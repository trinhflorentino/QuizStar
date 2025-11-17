import { useEffect } from 'react';

interface UseTimerParams {
  startTime: Date | null;
  duration: number | null;
  setRemainingTime: React.Dispatch<React.SetStateAction<number | null>>;
  onTimeUp: () => void;
}

export const useTimer = ({
  startTime,
  duration,
  setRemainingTime,
  onTimeUp
}: UseTimerParams) => {
  
  useEffect(() => {
    if (startTime && duration) {
      const interval = setInterval(() => {
        const now = new Date();
        const elapsedMs = now.getTime() - startTime.getTime();
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const remainingMinutes = duration - elapsedMinutes;
        
        if (remainingMinutes <= 0) {
          clearInterval(interval);
          onTimeUp();
        } else {
          setRemainingTime(remainingMinutes);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [startTime, duration, setRemainingTime, onTimeUp]);
};

