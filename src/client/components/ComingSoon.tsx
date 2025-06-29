import React from 'react';
import { GameScreen } from './GameScreen';
import type { DifficultyMode } from '../../shared/types/navigation';

interface ComingSoonProps {
  selectedDifficulty: DifficultyMode | null;
  onBackToHome: () => void;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  selectedDifficulty, 
  onBackToHome 
}) => {
  // If we have a selected difficulty, show the game screen
  if (selectedDifficulty) {
    return (
      <GameScreen 
        difficulty={selectedDifficulty} 
        onBackToHome={onBackToHome}
      />
    );
  }

  // Fallback for when no difficulty is selected
  return (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        COMING SOON...
      </div>
      
      <div className="lcd-text lcd-text-small">
        Please select a difficulty
      </div>
      <div className="lcd-text lcd-text-small">
        to start the game
      </div>
    </div>
  );
};