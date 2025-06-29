import React from 'react';
import type { DifficultyMode } from '../../shared/types/navigation';

interface ComingSoonProps {
  selectedDifficulty: DifficultyMode | null;
}

const DIFFICULTY_LABELS: Record<DifficultyMode, string> = {
  easy: 'EASY MODE',
  medium: 'MEDIUM MODE', 
  hard: 'HARD MODE',
  hardcore: 'HARDCORE MODE',
  godtier: 'GOD TIER MODE',
};

export const ComingSoon: React.FC<ComingSoonProps> = ({ selectedDifficulty }) => {
  return (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        COMING SOON...
      </div>
      
      {selectedDifficulty && (
        <div className="lcd-text mb-8">
          {DIFFICULTY_LABELS[selectedDifficulty]}
        </div>
      )}
      
      <div className="lcd-text lcd-text-small">
        Game functionality will be
      </div>
      <div className="lcd-text lcd-text-small">
        implemented in Phase 2
      </div>
      
      <div className="lcd-text lcd-text-small mt-8">
        Press ◄ to return
      </div>
    </div>
  );
};