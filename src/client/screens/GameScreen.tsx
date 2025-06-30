import React, { useEffect, useRef } from 'react';
import { GameDisplay } from '../components/GameDisplay';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCalculator } from '../hooks/useCalculator';
import { useAppNavigation, useAppGame } from '../hooks/useAppState';
import { useGameInputHandlers } from '../hooks/useGameInputHandlers';
import type { WinOption, DifficultyMode } from '../../shared/types/navigation';

export const GameScreen: React.FC = () => {
  const { navigation, setScreen } = useAppNavigation();
  const { game, setGameStartVisible, setGameStarted, setGameInitialized } = useAppGame();
  const { registerHandlers, unregisterHandlers } = useGameInputHandlers();
  const initializationStarted = useRef(false);

  // Game logic hook
  const gameLogicResult = useGameLogic({
    difficulty: navigation.selectedDifficulty ?? 'easy',
    onGameEnd: (finalScore, won) => {
      console.log('Game ended:', { finalScore, won });
      // Win display will be handled automatically by the game logic
    },
    onWinOptionSelect: (option: WinOption, currentDifficulty: DifficultyMode) => {
      console.log('Win option selected:', option, 'Current difficulty:', currentDifficulty);
      
      switch (option) {
        case 'NEXT_DIFFICULTY':
          // Move to next difficulty level
          setScreen('DIFFICULTY_SELECTION');
          // TODO: Set the next difficulty and start game
          break;
        
        case 'SAME_DIFFICULTY':
          // Restart the same difficulty
          setGameStartVisible(true);
          setGameStarted(false);
          gameLogicResult.resetGame();
          initializationStarted.current = false;
          
          // Show "GAME START" message and restart
          setTimeout(() => {
            setGameStartVisible(false);
            gameLogicResult.initializeGame();
            setGameStarted(true);
          }, 2000);
          break;
        
        case 'GO_HOME':
          // Return to main menu
          setScreen('MAIN_MENU');
          gameLogicResult.resetGame();
          setGameStarted(false);
          initializationStarted.current = false;
          break;
      }
    },
  });

  // Calculator hook
  const calculatorResult = useCalculator({
    buttonMapping: gameLogicResult.gameState?.buttonMapping || { numbers: {}, operators: {} },
    onEquationComplete: gameLogicResult.handleEquationComplete,
    disabled: !gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing',
  });

  // Initialize game when screen becomes active
  useEffect(() => {
    console.log('GameScreen useEffect - isInitialized:', gameLogicResult.isInitialized, 'gameState:', gameLogicResult.gameState, 'initializationStarted:', initializationStarted.current);
    
    if (!gameLogicResult.isInitialized && !initializationStarted.current) {
      console.log('Starting game initialization sequence...');
      initializationStarted.current = true;
      setGameStartVisible(true);
      setGameStarted(false);
      
      // Show "GAME START" message for 2 seconds
      const timer = setTimeout(() => {
        console.log('Timer fired - calling initializeGame()');
        setGameStartVisible(false);
        gameLogicResult.initializeGame();
        setGameStarted(true);
        setGameInitialized(true);
        console.log('Game initialization complete');
      }, 2000);

      return () => {
        console.log('Cleanup timer');
        clearTimeout(timer);
      };
    }
  }, [gameLogicResult.isInitialized]);

  // Game start message component
  const GameStartMessage: React.FC = () => (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        GAME START
      </div>
      <div className="lcd-text">
        {(navigation.selectedDifficulty || 'easy').toUpperCase()} MODE
      </div>
      <div className="lcd-text lcd-text-small mt-8">
        Initializing...
      </div>
    </div>
  );

  // Game interface component
  const GameInterface: React.FC = () => {
    console.log('GameInterface rendering - gameState exists:', !!gameLogicResult.gameState, 'isInitialized:', gameLogicResult.isInitialized);
    
    if (!gameLogicResult.gameState) {
      console.log('No game state, showing loading...');
      return (
        <div className="text-center">
          <div className="lcd-text">Loading game...</div>
        </div>
      );
    }

    console.log('Game state exists, rendering game display with state:', gameLogicResult.gameState);

    // Create enhanced game state for display
    const enhancedGameState = {
      ...gameLogicResult.gameState,
      userInput: calculatorResult.userInput,
      calculatorDisplay: calculatorResult.display,
      showResult: calculatorResult.showResult,
    };

    // Explicitly set lastResult if it exists
    if (calculatorResult.lastResult !== undefined) {
      enhancedGameState.lastResult = calculatorResult.lastResult;
    }

    console.log('Enhanced game state for display:', enhancedGameState);
    return <GameDisplay gameState={enhancedGameState} />;
  };

  // Register game input handlers for use by input handling system
  React.useEffect(() => {
    const handlers = {
      handleGameButtonPress: (buttonId: string) => {
        // Check if we're in win display mode first
        if (gameLogicResult.gameState?.gameStatus === 'won' && gameLogicResult.gameState?.showWinDisplay) {
          // Route to win display navigation
          const handled = gameLogicResult.handleWinDisplayInput(buttonId);
          if (handled) return true;
        }
        
        // Normal game button handling
        if (!gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing') return false;
        calculatorResult.handleButtonPress(buttonId);
        return true;
      },
      isGameActive: Boolean(!game.showGameStart && game.gameStarted && gameLogicResult.gameState && gameLogicResult.gameState.gameStatus === 'playing'),
      isWinDisplay: Boolean(gameLogicResult.gameState?.gameStatus === 'won' && gameLogicResult.gameState?.showWinDisplay),
    };

    registerHandlers(handlers);

    return () => {
      unregisterHandlers();
    };
  }, [calculatorResult, gameLogicResult, game.showGameStart, game.gameStarted, registerHandlers, unregisterHandlers]);

  // Render the appropriate game phase
  console.log('GameScreen render decision - showGameStart:', game.showGameStart, 'gameStarted:', game.gameStarted, 'isInitialized:', game.isInitialized);
  
  if (game.showGameStart) {
    console.log('Rendering GameStartMessage');
    return <GameStartMessage />;
  }

  console.log('Rendering GameInterface');
  return <GameInterface />;
}; 