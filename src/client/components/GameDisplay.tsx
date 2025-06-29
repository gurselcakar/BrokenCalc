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

  // Determine what to show in the input area (bottom-right)
  const getInputDisplay = () => {
    // If we have a calculated result, show it with equals sign
    if (gameState.lastResult !== undefined) {
      return `= ${gameState.lastResult}`;
    }
    
    // Otherwise show the equation being built
    return formatUserInput(gameState.userInput);
  };

  // Determine what to show in feedback area
  const getFeedbackContent = () => {
    if (gameState.gameStatus === 'won') {
      return 'CORRECT!';
    }
    
    // Show "INCORRECT" if we have a result that doesn't match the target
    if (gameState.lastResult !== undefined) {
      const isCorrect = Math.abs(gameState.lastResult - gameState.problem.targetValue) < 0.001;
      if (!isCorrect) {
        return 'INCORRECT';
      }
    }
    
    return '';
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

      {/* User Input/Result - Bottom Right */}
      <div className="game-display-input">
        <div className="lcd-text text-right">
          {getInputDisplay()}
        </div>
      </div>

      {/* Feedback Area - Bottom Left */}
      <div className="game-display-feedback">
        <div className="lcd-text lcd-text-small">
          {getFeedbackContent()}
        </div>
      </div>
    </div>
  );
};