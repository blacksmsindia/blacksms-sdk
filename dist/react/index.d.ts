interface UseOtpTimerOptions {
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
interface UseOtpTimerReturn {
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
declare function useOtpTimer(options?: UseOtpTimerOptions): UseOtpTimerReturn;

export { type UseOtpTimerOptions, type UseOtpTimerReturn, useOtpTimer };
