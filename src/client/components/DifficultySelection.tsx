import React from 'react';
import type { DifficultyMode } from '../../shared/types/navigation';

interface DifficultySelectionProps {
  selectedDifficulty: DifficultyMode | null;
}

const DIFFICULTY_LABELS: Record<DifficultyMode, string> = {
  easy: 'EASY',
  medium: 'MEDIUM', 
  hard: 'HARD',
  hardcore: 'HARDCORE',
  godtier: 'GOD TIER',
};

const DIFFICULTY_DESCRIPTIONS: Record<DifficultyMode, string> = {
  easy: 'Numbers scrambled only',
  medium: 'Numbers + operators mixed',
  hard: 'Everything mixed together',
  hardcore: 'Maximum chaos mode',
  godtier: 'The impossible challenge',
};

export const DifficultySelection: React.FC<DifficultySelectionProps> = ({
  selectedDifficulty,
}) => {
  return (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-6">
        SELECT DIFFICULTY
      </div>
      
      {selectedDifficulty && (
        <>
          <div className="lcd-text text-center mb-2">
            <span className="menu-item selected">
              &gt;{DIFFICULTY_LABELS[selectedDifficulty]}
            </span>
          </div>
          
          <div className="lcd-text lcd-text-small text-center mt-4">
            {DIFFICULTY_DESCRIPTIONS[selectedDifficulty]}
          </div>
        </>
      )}
      
      <div className="lcd-text lcd-text-small text-center mt-8">
        Use ▲▼ to navigate
      </div>
      <div className="lcd-text lcd-text-small text-center">
        Press OK to start
      </div>
    </div>
  );
};