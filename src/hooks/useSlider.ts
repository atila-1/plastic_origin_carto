import { useRef, useState } from 'react';

export const useSlider = (startDate: Date | null, endDate: Date | null) => {
  const [currentDate, setCurrentDate] = useState<Date | null>(startDate);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);

  const startProgress = (): void => {
    if (!startDate || !endDate || isPlaying) return;
    setIsPlaying(true);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const stepDuration = totalDuration / 100;
    if (!currentDate) {
      setCurrentDate(startDate);
    }
    intervalRef.current = setInterval(() => {
      setCurrentDate((prevDate) => {
        if (!prevDate) return null;
        const newDate = new Date(prevDate.getTime() + stepDuration);
        if (newDate >= endDate) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return endDate;
        }
        return newDate;
      });

      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!);
          setIsPlaying(false);
          return 100;
        }
        return newProgress;
      });
    }, 150);
  };

  const pauseProgress = (): void => {
    clearInterval(intervalRef.current!);
    setIsPlaying(false);
  };


  const resetProgress = (): void => {
    clearInterval(intervalRef.current!);
    setIsPlaying(false);
    setProgress(0);
    setCurrentDate(startDate);
  };

  return {
    currentDate,
    progress,
    isPlaying,
    startProgress,
    pauseProgress,
    resetProgress,
  };
};