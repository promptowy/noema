import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { AppState, ControlProfile } from "../electron/types";
import { AssistantPanel } from "./components/AssistantPanel";
import { BookmarksPage, HistoryPage, SettingsPage } from "./components/LibraryPages";
import { ControlCenter } from "./components/ControlCenter";
import { Sidebar } from "./components/Sidebar";
import { StartPage } from "./components/StartPage";
import { TitleBar } from "./components/TitleBar";
import { TopBar } from "./components/TopBar";
import { isInternalUrl, isNewTab } from "./lib/browser";

type ViewMode = "browser" | "bookmarks" | "history" | "settings";
type AppMode = "control" | "session";

const hiddenBounds = { x: 0, y: 0, width: 0, height: 0 };

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [appMode, setAppMode] = useState<AppMode>("control");
  const [viewMode, setViewMode] = useState<ViewMode>("browser");
  const [aiOpen, setAiOpen] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<ControlProfile | null>(null);
  const webSlotRef = useRef<HTMLDivElement | null>(null);

  const activeTab = useMemo(
    () => state?.tabs.find((tab) => tab.id === state.activeTabId),
    [state]
  );

  const showWebContent =
    appMode === "session" &&
    viewMode === "browser" &&
    Boolean(activeTab) &&
    !isInternalUrl(activeTab?.url ?? "");

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
  }, [activeTab?.id, aiOpen, appMode, showWebContent, viewMode]);

  if (!state) {
    return (
      <div className="grid h-screen place-items-center bg-[#060504] text-[#f4ecdc]">
        <div className="rounded-2xl border border-[#e7c989]/[0.15] bg-[#15120d]/[0.80] px-6 py-4 text-sm shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          Opening Noema
        </div>
      </div>
    );
  }

  function navigate(input: string) {
    setAppMode("session");
    setViewMode("browser");
    window.browserAPI.navigate({ input });
  }

  function openSession(profile: ControlProfile) {
    setSelectedProfile(profile);
    setAppMode("session");
    setViewMode("browser");
  }

  function returnToControlCenter() {
    setAppMode("control");
    window.browserAPI.setContentBounds(hiddenBounds);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_28%_-10%,rgba(231,201,137,0.13),transparent_34%),linear-gradient(135deg,#050403_0%,#0b0907_46%,#050504_100%)] text-[#f4ecdc]">
      <TitleBar />
      {appMode === "control" ? (
        <ControlCenter onStartProfile={openSession} />
      ) : (
        <div className="flex min-h-0 flex-1">
        <Sidebar
          activeTabId={state.activeTabId}
          sessionLabel={selectedProfile?.name ?? "Noema Session"}
          sessionWorkspace={selectedProfile?.workspace ?? "Personal workspace"}
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

        <main className="flex min-w-0 flex-1 flex-col bg-[#080706]/[0.55]">
          <TopBar
            activeTab={activeTab}
            aiOpen={aiOpen}
            bookmarks={state.bookmarks}
            sessionLabel={selectedProfile?.name ?? "Noema Session"}
            sessionWorkspace={selectedProfile?.workspace ?? "Personal workspace"}
            onBack={() => window.browserAPI.goBack()}
            onBackToControl={returnToControlCenter}
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
                  <div className="relative h-full overflow-hidden rounded-[22px] border border-[#e7c989]/[0.12] bg-[#080706]/[0.85] shadow-[0_28px_100px_rgba(0,0,0,0.48)]">
                    <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgba(255,248,232,0.08)]" />
                    <div
                      ref={webSlotRef}
                      className="absolute inset-px overflow-hidden rounded-[21px]"
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
      )}
    </div>
  );
}
