import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialMinutes,
  onTimeUp,
  isPaused = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialMinutes * 60);
  const totalSeconds = initialMinutes * 60;

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isLowTime = secondsLeft < 300; // less than 5 mins
  const isCriticalTime = secondsLeft < 60; // less than 1 min

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner transition-colors ${
        isCriticalTime
          ? 'bg-red-600 text-white border-red-700 animate-pulse'
          : isLowTime
          ? 'bg-amber-100 text-amber-900 border-amber-300'
          : 'bg-stone-900 text-amber-300 border-stone-800'
      }`}
    >
      <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-500 animate-spin' : 'text-amber-400'}`} />
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-mono text-sm sm:text-base font-bold tracking-wider leading-none">
          {hours > 0 && <span>{String(hours).padStart(2, '0')}:</span>}
          <span>{String(minutes).padStart(2, '0')}</span>:
          <span>{String(seconds).padStart(2, '0')}</span>
        </div>
        <div className="w-16 sm:w-20 bg-stone-700/50 h-1 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isCriticalTime ? 'bg-red-400' : isLowTime ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isLowTime && (
        <span className="hidden sm:inline-block text-[10px] font-semibold bg-red-500/20 text-red-600 px-1 rounded">
          कम समय शेष!
        </span>
      )}
    </div>
  );
};
