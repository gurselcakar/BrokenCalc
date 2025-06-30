import React from 'react';
import type { GameState } from '../../shared/types/game';
import type { WinOption } from '../../shared/types/navigation';

interface GameDisplayProps {
  gameState: GameState;
}

const WinDisplay: React.FC<{
  finalScore: number;
  currentDifficulty: string;
  selectedOption: WinOption;
}> = ({ finalScore, currentDifficulty, selectedOption }) => {
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'EASY';
      case 'medium': return 'MEDIUM';
      case 'hard': return 'HARD';
      case 'hardcore': return 'HARDCORE';
      case 'godtier': return 'GOD TIER';
      default: return difficulty.toUpperCase();
    }
  };

  const getSelectedOptionLabel = (option: WinOption) => {
    switch (option) {
      case 'NEXT_DIFFICULTY': return 'NEXT DIFFICULTY';
      case 'SAME_DIFFICULTY': return 'PLAY AGAIN';
      case 'GO_HOME': return 'GO HOME';
      default: return option;
    }
  };

  return (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-8">
        CONGRATULATIONS!
      </div>
      
      <div className="lcd-text text-center">
        {getDifficultyLabel(currentDifficulty)} COMPLETE - SCORE: {finalScore}
      </div>
      
      <div className="lcd-text text-center mt-4">
        <span className="menu-item selected">
          &gt;{getSelectedOptionLabel(selectedOption)}
        </span>
      </div>

      <div className="lcd-text lcd-text-small text-center mt-8">
        Use + - to navigate, = to select
      </div>
    </div>
  );
};

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
    if (gameState.showResult && gameState.lastResult !== undefined) {
      return `= ${gameState.lastResult}`;
    }
    return formatUserInput(gameState.userInput);
  };

  // Determine what to show in feedback area
  const getFeedbackContent = () => {
    if (gameState.gameStatus === 'won' && !gameState.showWinDisplay) {
      return 'CORRECT!';
    }
    
    // Show "INCORRECT" if we have a result that doesn't match the target and we're showing the result
    if (gameState.showResult && gameState.lastResult !== undefined) {
      const isCorrect = Math.abs(gameState.lastResult - gameState.problem.targetValue) < 0.001;
      if (!isCorrect) {
        return 'INCORRECT';
      }
    }
    
    return '';
  };

  // Show win display if game is won and showWinDisplay is true
  if (gameState.gameStatus === 'won' && gameState.showWinDisplay) {
    return (
      <WinDisplay
        finalScore={gameState.finalScore || 0}
        currentDifficulty={gameState.mode}
        selectedOption={gameState.selectedWinOption || 'NEXT_DIFFICULTY'}
      />
    );
  }

  return (
    <div className="game-display relative w-full h-full min-h-24">
      {/* Timer - Top Left */}
      <div className="absolute top-0 left-0">
        <div className="lcd-text lcd-text-small">
          {formatTime(gameState.timeRemaining)}
        </div>
      </div>

      {/* Equation - Top Center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
        <div className="lcd-text text-center">
          {gameState.problem.equation}
        </div>
      </div>

      {/* User Input/Result - Bottom Right */}
      <div className="absolute bottom-0 right-0">
        <div className="lcd-text text-right">
          {getInputDisplay()}
        </div>
      </div>

      {/* Feedback Area - Bottom Left */}
      <div className="absolute bottom-0 left-0">
        <div className="lcd-text lcd-text-small">
          {getFeedbackContent()}
        </div>
      </div>
    </div>
  );
};