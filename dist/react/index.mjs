// src/react/index.ts
import { useState, useEffect, useCallback } from "react";
function useOtpTimer(options) {
  const initialSeconds = options?.seconds ?? 60;
  const autoStart = options?.autoStart ?? true;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1e3);
    } else if (timeLeft <= 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  const startTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);
  const resetTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return {
    timeLeft,
    formattedTime,
    isActive,
    canResend: !isActive && timeLeft === 0,
    startTimer,
    resetTimer
  };
}
export {
  useOtpTimer
};
//# sourceMappingURL=index.mjs.map