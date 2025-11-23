import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow';
  showPercentage?: boolean;
}

const colorClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};

export const ProgressBar = ({
  progress,
  label,
  color = 'blue',
  showPercentage = true,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
