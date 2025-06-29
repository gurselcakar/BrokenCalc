import React from 'react';
import type { GameState } from '../../shared/types/game';

interface GameDisplayProps {
  gameState: GameState;
}

export const GameDisplay: React.FC<GameDisplayProps> = ({ gameState }) => {
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format user input for display (show equation building)
  const formatUserInput = (input: string): string => {
    if (!input) return '';
    
    // Show the equation as it's being built
    // e.g., "3" -> "3+" -> "3+4"
    return input;
  };

  return (
    <div className="game-display">
      {/* Timer - Top Left */}
      <div className="game-display-timer">
        <div className="lcd-text lcd-text-small">
          {formatTime(gameState.timeRemaining)}
        </div>
      </div>

      {/* Equation - Top Center */}
      <div className="game-display-equation">
        <div className="lcd-text text-center">
          {gameState.problem.equation}
        </div>
      </div>

      {/* User Input - Bottom Right */}
      <div className="game-display-input">
        <div className="lcd-text text-right">
          {formatUserInput(gameState.userInput)}
        </div>
      </div>

      {/* Feedback Area - Bottom Left */}
      <div className="game-display-feedback">
        {gameState.lastResult !== undefined && (
          <div className="lcd-text lcd-text-small">
            = {gameState.lastResult}
          </div>
        )}
      </div>
    </div>
  );
};