import type {
  AppState,
  BrowserBounds,
  ControlProfile,
  NavigatePayload,
  ProfileDraft,
  ProfileSessionResult,
  ProfileUpdate,
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
  profiles: {
    list: () => Promise<ControlProfile[]>;
    startSession: (id: string) => Promise<ProfileSessionResult>;
    endSession: () => Promise<ControlProfile[]>;
    create: (draft: ProfileDraft) => Promise<ControlProfile[]>;
    update: (patch: ProfileUpdate) => Promise<ControlProfile[]>;
    delete: (id: string) => Promise<ControlProfile[]>;
    resetDemoData: () => Promise<ControlProfile[]>;
  };
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
