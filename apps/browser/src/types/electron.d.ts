import type {
  AppState,
  BrowserBounds,
  NavigatePayload,
  SettingsPatch
} from "../../electron/types";

type BrowserApi = {
  getState: () => Promise<AppState>;
  onStateChange: (listener: (state: AppState) => void) => () => void;
  setContentBounds: (bounds: BrowserBounds) => Promise<void>;
  navigate: (payload: NavigatePayload) => Promise<void>;
  createTab: (input?: string) => Promise<string>;
  closeTab: (tabId: string) => Promise<void>;
  switchTab: (tabId: string) => Promise<void>;
  goBack: () => Promise<void>;
  goForward: () => Promise<void>;
  reload: () => Promise<void>;
  toggleBookmark: (tabId?: string) => Promise<void>;
  updateSettings: (patch: SettingsPatch) => Promise<void>;
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
};

declare global {
  interface Window {
    browserAPI: BrowserApi;
  }
}

export {};
