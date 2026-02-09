import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultProgress: ProgressData = {
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
};

type ProgressContextValue = {
  progress: ProgressData;
  updateLesson: (lessonId: string, stars: number, timeMs: number) => Promise<void>;
  setSettings: (settings: Partial<ProgressData["settings"]>) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const readInitialProgress = async (): Promise<ProgressData> => {
  if (window.appAPI?.readProgress) {
    return window.appAPI.readProgress();
  }
  const stored = localStorage.getItem("progress");
  return stored ? (JSON.parse(stored) as ProgressData) : defaultProgress;
};

const writeProgress = async (data: ProgressData) => {
  if (window.appAPI?.writeProgress) {
    await window.appAPI.writeProgress(data);
  } else {
    localStorage.setItem("progress", JSON.stringify(data));
  }
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    let mounted = true;
    readInitialProgress().then((data) => {
      if (mounted) setProgress(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const updateLesson = async (lessonId: string, stars: number, timeMs: number) => {
    const current = progress.modules.mouse.lessons[lessonId];
    const bestTimeMs =
      current?.bestTimeMs === null || timeMs < (current?.bestTimeMs ?? Infinity)
        ? timeMs
        : current.bestTimeMs;
    const updated: ProgressData = {
      ...progress,
      modules: {
        ...progress.modules,
        mouse: {
          ...progress.modules.mouse,
          lessons: {
            ...progress.modules.mouse.lessons,
            [lessonId]: {
              stars: Math.max(current?.stars ?? 0, stars),
              bestTimeMs
            }
          },
          lastLesson: lessonId
        }
      }
    };
    setProgress(updated);
    await writeProgress(updated);
  };

  const setSettings = async (settings: Partial<ProgressData["settings"]>) => {
    const updated = {
      ...progress,
      settings: {
        ...progress.settings,
        ...settings
      }
    };
    setProgress(updated);
    await writeProgress(updated);
  };

  const value = useMemo(() => ({ progress, updateLesson, setSettings }), [progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
};
