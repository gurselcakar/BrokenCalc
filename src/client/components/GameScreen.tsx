import React, { useState, useEffect } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { GameDisplay } from './GameDisplay';
import { Calculator } from './Calculator';
import type { DifficultyMode, GameState } from '../../shared/types/game';

interface GameScreenProps {
  difficulty: DifficultyMode;
  onBackToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  difficulty,
  onBackToHome,
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showGameStart, setShowGameStart] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    // Show "GAME START" message for 2 seconds
    const startTimer = setTimeout(() => {
      setShowGameStart(false);
      setIsTransitioning(true);
      
      // Initialize game state after transition
      setTimeout(() => {
        initializeGame();
        setIsTransitioning(false);
      }, 300);
    }, 2000);

    return () => clearTimeout(startTimer);
  }, [difficulty]);

  const initializeGame = () => {
    // TODO: This will be replaced with actual game initialization
    // For now, create a placeholder game state
    const placeholderGame: GameState = {
      mode: difficulty,
      problem: {
        equation: '_ + _ = 7',
        targetValue: 7,
        possibleSolutions: ['1+6', '2+5', '3+4', '4+3', '5+2', '6+1'],
        difficulty: difficulty,
      },
      buttonMapping: {
        numbers: {}, // Will be populated by scrambler
        operators: {},
      },
      calculatorDisplay: '',
      timeRemaining: 120, // 2 minutes
      gameStatus: 'playing',
      userInput: '',
    };

    setGameState(placeholderGame);
  };

  const handleButtonPress = (buttonId: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    console.log('Button pressed:', buttonId);
    
    // TODO: Implement actual button press logic with scrambling
    // For now, just log the button press
    
    setGameState(prev => {
      if (!prev) return prev;
      
      // Simple placeholder logic - just append to user input
      let newInput = prev.userInput;
      
      if (buttonId === 'delete') {
        newInput = newInput.slice(0, -1);
      } else if (buttonId === 'equals') {
        // TODO: Implement equation validation
        console.log('Equals pressed, current input:', newInput);
      } else {
        newInput += buttonId;
      }
      
      return {
        ...prev,
        userInput: newInput,
        calculatorDisplay: newInput,
      };
    });
  };

  const renderGameStartMessage = () => (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        GAME START
      </div>
      <div className="lcd-text">
        {difficulty.toUpperCase()} MODE
      </div>
      <div className="lcd-text lcd-text-small mt-8">
        Initializing...
      </div>
    </div>
  );

  const renderGameInterface = () => {
    if (!gameState) {
      return (
        <div className="text-center">
          <div className="lcd-text">Loading game...</div>
        </div>
      );
    }

    return (
      <>
        <GameDisplay gameState={gameState} />
        <Calculator 
          onButtonPress={handleButtonPress}
          disabled={gameState.gameStatus !== 'playing'}
          className="mt-4"
        />
      </>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center p-2 overflow-hidden">
      <CalculatorDisplay isTransitioning={isTransitioning}>
        {showGameStart ? renderGameStartMessage() : renderGameInterface()}
      </CalculatorDisplay>
    </div>
  );
};