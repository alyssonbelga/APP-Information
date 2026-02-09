import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";

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

const createDefaultProgress = (): ProgressData => ({
  version: 1,
  modules: {
    mouse: {
      lessons: {
        "clique-simples": { stars: 0, bestTimeMs: null },
        "clique-duplo": { stars: 0, bestTimeMs: null },
        "arrastar-soltar": { stars: 0, bestTimeMs: null }
      }
    }
  },
  settings: {
    largeCursor: false,
    largeText: false
  }
});

const getProgressPath = () => path.join(app.getPath("userData"), "progress.json");

const readProgress = (): ProgressData => {
  const progressPath = getProgressPath();
  try {
    const raw = fs.readFileSync(progressPath, "utf-8");
    return JSON.parse(raw) as ProgressData;
  } catch {
    const initial = createDefaultProgress();
    fs.mkdirSync(path.dirname(progressPath), { recursive: true });
    fs.writeFileSync(progressPath, JSON.stringify(initial, null, 2));
    return initial;
  }
};

const writeProgress = (data: ProgressData) => {
  const progressPath = getProgressPath();
  fs.mkdirSync(path.dirname(progressPath), { recursive: true });
  fs.writeFileSync(progressPath, JSON.stringify(data, null, 2));
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
  }
};

app.whenReady().then(() => {
  ipcMain.handle("progress:read", () => readProgress());
  ipcMain.handle("progress:write", (_event, data: ProgressData) => {
    writeProgress(data);
    return data;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
