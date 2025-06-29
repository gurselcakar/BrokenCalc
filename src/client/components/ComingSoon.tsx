import React, { useEffect } from 'react';
import type { DifficultyMode } from '../../shared/types/navigation';

interface ComingSoonProps {
  selectedDifficulty: DifficultyMode | null;
  onBackToHome: () => void;
  onStartGame?: () => void;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  selectedDifficulty, 
  onBackToHome,
  onStartGame 
}) => {
  // Automatically start the game if we have onStartGame and a selected difficulty
  useEffect(() => {
    if (selectedDifficulty && onStartGame) {
      // Start game after a brief moment
      const timer = setTimeout(() => {
        onStartGame();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedDifficulty, onStartGame]);

  // If we have a selected difficulty, show the transition screen
  if (selectedDifficulty) {
    return (
      <div className="text-center">
        <div className="lcd-text lcd-text-large mb-6">
          {onStartGame ? 'STARTING...' : 'COMING SOON'}
        </div>
        <div className="lcd-text mb-8">
          {selectedDifficulty?.toUpperCase()} MODE
        </div>
        <div className="lcd-text lcd-text-small">
          {onStartGame ? 'Preparing game...' : 'Game implementation in progress...'}
        </div>
        {!onStartGame && (
          <div className="lcd-text lcd-text-small mt-4">
            Press ◄ to return
          </div>
        )}
      </div>
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