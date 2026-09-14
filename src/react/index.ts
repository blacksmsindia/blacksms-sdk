import { useState, useEffect, useCallback } from 'react';

export interface UseOtpTimerOptions {
  /**
   * Initial countdown duration in seconds.
   * @default 60
   */
  seconds?: number;

  /**
   * Auto start timer on mount.
   * @default true
   */
  autoStart?: boolean;
}

export interface UseOtpTimerReturn {
  /**
   * Remaining time in seconds.
   */
  timeLeft: number;

  /**
   * Formatted time string (e.g. "00:59").
   */
  formattedTime: string;

  /**
   * Whether the timer is currently actively counting down.
   */
  isActive: boolean;

  /**
   * Whether the timer has completed and resend is allowed.
   */
  canResend: boolean;

  /**
   * Start or restart the countdown.
   */
  startTimer: () => void;

  /**
   * Reset the timer to initial duration without starting automatically.
   */
  resetTimer: () => void;
}

/**
 * React hook to manage OTP resend timer countdowns.
 */
export function useOtpTimer(options?: UseOtpTimerOptions): UseOtpTimerReturn {
  const initialSeconds = options?.seconds ?? 60;
  const autoStart = options?.autoStart ?? true;

  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(autoStart);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
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
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    timeLeft,
    formattedTime,
    isActive,
    canResend: !isActive && timeLeft === 0,
    startTimer,
    resetTimer
  };
}
