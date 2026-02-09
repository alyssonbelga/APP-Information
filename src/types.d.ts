export {};

declare global {
  interface Window {
    appAPI: {
      readProgress: () => Promise<ProgressData>;
      writeProgress: (data: ProgressData) => Promise<ProgressData>;
    };
  }

  type LessonProgress = { stars: number; bestTimeMs: number | null };
  type ProgressData = {
    version: number;
    modules: {
      mouse: {
        lessons: Record<string, LessonProgress>;
        lastLesson?: string;
      };
    };
    settings: {
      largeCursor: boolean;
      largeText: boolean;
    };
  };
}
