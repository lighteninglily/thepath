import { Clock } from 'lucide-react';
import { useServicePresentationStore } from '../../store/servicePresentationStore';

interface PresentationTimerProps {
  className?: string;
  showProgress?: boolean;
}

/**
 * Professional presentation timer with:
 * - Count-up or countdown mode
 * - Color-coded warnings (green/yellow/orange/red)
 * - Visual progress bar
 * - Target duration tracking
 */
export function PresentationTimer({ className = '', showProgress = true }: PresentationTimerProps) {
  const {
    elapsedTime,
    timerMode,
    targetDuration,
    getTimerWarningLevel,
    getTimerPercentage,
  } = useServicePresentationStore();

  const warningLevel = getTimerWarningLevel();
  const percentage = getTimerPercentage();

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate display time based on mode
  const displayTime = timerMode === 'countdown' && targetDuration
    ? targetDuration - elapsedTime
    : elapsedTime;

  // Get color based on warning level
  const getColors = () => {
    switch (warningLevel) {
      case 'normal':
        return {
          text: 'text-green-500',
          bg: 'bg-green-500',
          border: 'border-green-500',
        };
      case 'warning':
        return {
          text: 'text-yellow-500',
          bg: 'bg-yellow-500',
          border: 'border-yellow-500',
        };
      case 'critical':
        return {
          text: 'text-orange-500',
          bg: 'bg-orange-500',
          border: 'border-orange-500',
        };
      case 'overtime':
        return {
          text: 'text-red-500',
          bg: 'bg-red-500',
          border: 'border-red-500',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`${className}`}>
      {/* Timer Display */}
      <div className="flex items-center gap-2 mb-2">
        <Clock size={20} className={colors.text} />
        <div className={`text-3xl font-mono font-bold ${colors.text}`}>
          {formatTime(displayTime)}
        </div>
      </div>

      {/* Mode Label */}
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
        {timerMode === 'countdown' ? 'Countdown' : 'Elapsed Time'}
        {targetDuration && timerMode === 'countup' && (
          <span className="ml-2">/ {formatTime(targetDuration)}</span>
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && targetDuration && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${colors.bg}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Warning Messages */}
      {warningLevel === 'warning' && (
        <div className="mt-2 text-xs text-yellow-400">
          ⚠️ Approaching target time
        </div>
      )}
      {warningLevel === 'critical' && (
        <div className="mt-2 text-xs text-orange-400">
          ⚠️ Near time limit!
        </div>
      )}
      {warningLevel === 'overtime' && (
        <div className="mt-2 text-xs text-red-400 font-bold animate-pulse">
          🚨 Over time!
        </div>
      )}

      {/* Target Duration Display (if set) */}
      {targetDuration && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Target: {formatTime(targetDuration)}
          </div>
        </div>
      )}
    </div>
  );
}
