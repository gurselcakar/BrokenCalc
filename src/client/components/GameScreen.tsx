import React, { useState, useEffect } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { GameDisplay } from './GameDisplay';
import { Calculator } from './Calculator';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCalculator } from '../hooks/useCalculator';
import type { DifficultyMode } from '../../shared/types/game';

interface GameScreenProps {
  difficulty: DifficultyMode;
  onBackToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  difficulty,
  onBackToHome,
}) => {
  const [showGameStart, setShowGameStart] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Game logic hook
  const {
    gameState,
    isInitialized,
    initializeGame,
    handleEquationComplete,
    resetGame,
  } = useGameLogic({
    difficulty,
    onGameEnd: (finalScore, won) => {
      console.log('Game ended:', { finalScore, won });
      // TODO: Show victory/defeat screen
    },
  });

  // Calculator hook
  const {
    display,
    userInput,
    lastResult,
    showResult,
    handleButtonPress: calculatorButtonPress,
    clear: clearCalculator,
  } = useCalculator({
    buttonMapping: gameState?.buttonMapping || { numbers: {}, operators: {} },
    onEquationComplete: handleEquationComplete,
    disabled: !gameState || gameState.gameStatus !== 'playing',
  });

  // Initialize game sequence
  useEffect(() => {
    // Show "GAME START" message for 2 seconds
    const startTimer = setTimeout(() => {
      setShowGameStart(false);
      setIsTransitioning(true);
      
      // Initialize game after transition
      setTimeout(() => {
        initializeGame();
        setIsTransitioning(false);
      }, 300);
    }, 2000);

    return () => {
      clearTimeout(startTimer);
      resetGame();
    };
  }, [difficulty, initializeGame, resetGame]);

  // Handle button press (combine game logic and calculator logic)
  const handleButtonPress = (buttonId: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    // Let calculator handle the button press with scrambling
    calculatorButtonPress(buttonId);
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
    if (!gameState || !isInitialized) {
      return (
        <div className="text-center">
          <div className="lcd-text">Loading game...</div>
        </div>
      );
    }

    // Create enhanced game state for display
    const enhancedGameState = {
      ...gameState,
      userInput: userInput, // Use calculator's user input
      lastResult: lastResult,
      calculatorDisplay: display,
    };

    return (
      <>
        <GameDisplay gameState={enhancedGameState} />
        <Calculator 
          onButtonPress={handleButtonPress}
          disabled={gameState.gameStatus !== 'playing'}
          className="mt-4"
        />
        
        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-gray-500">
            <div>Debug Info:</div>
            <div>User Input: {userInput}</div>
            <div>Display: {display}</div>
            <div>Target: {gameState.problem.targetValue}</div>
            <div>Solutions: {gameState.problem.possibleSolutions.join(', ')}</div>
            <div>Button Mapping: {JSON.stringify(gameState.buttonMapping.numbers)}</div>
          </div>
        )}
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