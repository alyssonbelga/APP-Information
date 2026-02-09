export const calculateStars = (errors: number, timeMs: number) => {
  const seconds = timeMs / 1000;
  if (errors === 0 && seconds <= 25) return 3;
  if (errors <= 2 && seconds <= 60) return 2;
  return 1;
};

export const formatTime = (timeMs: number) => {
  const seconds = Math.round(timeMs / 1000);
  return `${seconds}s`;
};
