import { contextBridge, ipcRenderer } from "electron";

type ProgressData = {
  version: number;
  modules: {
    mouse: {
      lessons: Record<string, { stars: number; bestTimeMs: number | null }>;
      lastLesson?: string;
    };
  };
  settings: {
    largeCursor: boolean;
    largeText: boolean;
  };
};

contextBridge.exposeInMainWorld("appAPI", {
  readProgress: (): Promise<ProgressData> => ipcRenderer.invoke("progress:read"),
  writeProgress: (data: ProgressData): Promise<ProgressData> =>
    ipcRenderer.invoke("progress:write", data)
});
