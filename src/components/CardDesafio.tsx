import type { Challenge } from '../types';
import { ProgressBar } from './ProgressBar';
import { Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardDesafioProps {
  challenge: Challenge;
  onSelect?: (challenge: Challenge) => void;
}

const difficultyConfig = {
  easy: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    icon: '🟢',
    label: 'Fácil',
  },
  medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-700 dark:text-yellow-300',
    icon: '🟡',
    label: 'Médio',
  },
  hard: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
    icon: '🔴',
    label: 'Difícil',
  },
};

export const CardDesafio = ({ challenge, onSelect }: CardDesafioProps) => {
  const difficultyConfig_ = difficultyConfig[challenge.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect?.(challenge)}
      whileHover={{ scale: 1.02, y: -5 }}
      className="card cursor-pointer group hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <p className="text-sm text-muted mt-1">
            {challenge.category}
          </p>
        </div>
        {challenge.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-shrink-0 ml-2"
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      {/* Difficulty and XP */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyConfig_.bg} ${difficultyConfig_.text}`}>
          {difficultyConfig_.icon} {difficultyConfig_.label}
        </span>
        <div className="flex items-center gap-1 text-yellow-500 font-semibold">
          <Zap className="w-4 h-4" />
          {challenge.xpReward} XP
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        progress={challenge.progress}
        color={challenge.completed ? 'green' : 'blue'}
        showPercentage={true}
      />

      {/* Status Badge */}
      <div className="mt-4 flex items-center gap-2">
        {challenge.completed ? (
          <span className="badge-success text-xs">
            ✓ Concluído
          </span>
        ) : (
          <span className="badge-warning text-xs">
            ⏳ Em Progresso
          </span>
        )}
      </div>
    </motion.div>
  );
};
