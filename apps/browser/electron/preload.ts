import { contextBridge, ipcRenderer } from "electron";
import type {
  AppState,
  BrowserBounds,
  ControlProfile,
  NavigatePayload,
  ProfileDraft,
  ProfileSessionResult,
  ProfileUpdate,
  SettingsPatch
} from "./types";

const api = {
  getState: () => ipcRenderer.invoke("browser:get-state") as Promise<AppState>,
  onStateChange: (listener: (state: AppState) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, state: AppState) => {
      listener(state);
    };
    ipcRenderer.on("browser:state", handler);
    return () => ipcRenderer.removeListener("browser:state", handler);
  },
  setContentBounds: (bounds: BrowserBounds) =>
    ipcRenderer.invoke("browser:set-bounds", bounds) as Promise<void>,
  navigate: (payload: NavigatePayload) =>
    ipcRenderer.invoke("browser:navigate", payload) as Promise<void>,
  createTab: (input?: string) =>
    ipcRenderer.invoke("browser:create-tab", input) as Promise<string>,
  closeTab: (tabId: string) =>
    ipcRenderer.invoke("browser:close-tab", tabId) as Promise<void>,
  switchTab: (tabId: string) =>
    ipcRenderer.invoke("browser:switch-tab", tabId) as Promise<void>,
  goBack: () => ipcRenderer.invoke("browser:go-back") as Promise<void>,
  goForward: () => ipcRenderer.invoke("browser:go-forward") as Promise<void>,
  reload: () => ipcRenderer.invoke("browser:reload") as Promise<void>,
  toggleBookmark: (tabId?: string) =>
    ipcRenderer.invoke("browser:toggle-bookmark", tabId) as Promise<void>,
  updateSettings: (patch: SettingsPatch) =>
    ipcRenderer.invoke("browser:update-settings", patch) as Promise<void>,
  profiles: {
    list: () => ipcRenderer.invoke("profiles:list") as Promise<ControlProfile[]>,
    startSession: (id: string) =>
      ipcRenderer.invoke("profiles:start-session", id) as Promise<ProfileSessionResult>,
    endSession: () =>
      ipcRenderer.invoke("profiles:end-session") as Promise<ControlProfile[]>,
    create: (draft: ProfileDraft) =>
      ipcRenderer.invoke("profiles:create", draft) as Promise<ControlProfile[]>,
    update: (patch: ProfileUpdate) =>
      ipcRenderer.invoke("profiles:update", patch) as Promise<ControlProfile[]>,
    delete: (id: string) =>
      ipcRenderer.invoke("profiles:delete", id) as Promise<ControlProfile[]>,
    resetDemoData: () =>
      ipcRenderer.invoke("profiles:resetDemoData") as Promise<ControlProfile[]>
  },
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize") as Promise<void>,
    maximize: () => ipcRenderer.invoke("window:maximize") as Promise<void>,
    close: () => ipcRenderer.invoke("window:close") as Promise<void>
  }
};

contextBridge.exposeInMainWorld("browserAPI", api);
