import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AppState } from "../electron/types";
import { AssistantPanel } from "./components/AssistantPanel";
import { BookmarksPage, HistoryPage, SettingsPage } from "./components/LibraryPages";
import { Sidebar } from "./components/Sidebar";
import { StartPage } from "./components/StartPage";
import { TitleBar } from "./components/TitleBar";
import { TopBar } from "./components/TopBar";
import { isInternalUrl, isNewTab } from "./lib/browser";

type ViewMode = "browser" | "bookmarks" | "history" | "settings";

const hiddenBounds = { x: 0, y: 0, width: 0, height: 0 };

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [aiOpen, setAiOpen] = useState(true);
  const webSlotRef = useRef<HTMLDivElement | null>(null);

  const activeTab = useMemo(
    () => state?.tabs.find((tab) => tab.id === state.activeTabId),
    [state]
  );

  const showWebContent =
    viewMode === "browser" && Boolean(activeTab) && !isInternalUrl(activeTab?.url ?? "");

  useEffect(() => {
    let disposed = false;
    window.browserAPI.getState().then((nextState) => {
      if (!disposed) {
        setState(nextState);
      }
    });
    const unsubscribe = window.browserAPI.onStateChange((nextState) => {
      setState({ ...nextState });
    });

    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    let animationFrame = 0;

    function syncBounds() {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (!showWebContent || !webSlotRef.current) {
          window.browserAPI.setContentBounds(hiddenBounds);
          return;
        }

        const rect = webSlotRef.current.getBoundingClientRect();
        window.browserAPI.setContentBounds({
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      });
    }

    syncBounds();
    const observer = new ResizeObserver(syncBounds);
    if (webSlotRef.current) {
      observer.observe(webSlotRef.current);
    }
    observer.observe(document.body);
    window.addEventListener("resize", syncBounds);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", syncBounds);
      window.browserAPI.setContentBounds(hiddenBounds);
    };
  }, [activeTab?.id, aiOpen, showWebContent, viewMode]);

  if (!state) {
    return (
      <div className="grid h-screen place-items-center bg-radial-aura text-white">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-4 text-sm shadow-panel">
          Starting Noema
        </div>
      </div>
    );
  }

  function navigate(input: string) {
    setViewMode("browser");
    window.browserAPI.navigate({ input });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-radial-aura text-white">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeTabId={state.activeTabId}
          tabs={state.tabs}
          viewMode={viewMode}
          onCloseTab={(tabId) => window.browserAPI.closeTab(tabId)}
          onCreateTab={() => {
            setViewMode("browser");
            window.browserAPI.createTab();
          }}
          onSwitchTab={(tabId) => {
            setViewMode("browser");
            window.browserAPI.switchTab(tabId);
          }}
          onViewModeChange={setViewMode}
        />

        <main className="flex min-w-0 flex-1 flex-col bg-ink-900/[0.36]">
          <TopBar
            activeTab={activeTab}
            aiOpen={aiOpen}
            bookmarks={state.bookmarks}
            onBack={() => window.browserAPI.goBack()}
            onBookmark={() => window.browserAPI.toggleBookmark(activeTab?.id)}
            onForward={() => window.browserAPI.goForward()}
            onReload={() => window.browserAPI.reload()}
            onSubmit={navigate}
            onToggleAi={() => setAiOpen((open) => !open)}
          />

          <div className="flex min-h-0 flex-1">
            <section className="min-w-0 flex-1">
              {viewMode === "bookmarks" ? (
                <BookmarksPage bookmarks={state.bookmarks} onNavigate={navigate} />
              ) : null}
              {viewMode === "history" ? (
                <HistoryPage history={state.history} onNavigate={navigate} />
              ) : null}
              {viewMode === "settings" ? (
                <SettingsPage
                  state={state}
                  onNavigate={navigate}
                  onSettingsChange={window.browserAPI.updateSettings}
                />
              ) : null}
              {viewMode === "browser" && isNewTab(activeTab) ? (
                <StartPage
                  history={state.history}
                  onNavigate={navigate}
                  onOpenAi={() => setAiOpen(true)}
                />
              ) : null}
              {showWebContent ? (
                <div className="h-full p-4">
                  <div className="relative h-full rounded-2xl border border-white/10 bg-ink-950/[0.72] shadow-panel">
                    <div
                      ref={webSlotRef}
                      className="absolute inset-px overflow-hidden rounded-[15px]"
                    />
                  </div>
                </div>
              ) : null}
            </section>
            {aiOpen ? (
              <AssistantPanel activeTab={activeTab} onClose={() => setAiOpen(false)} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
