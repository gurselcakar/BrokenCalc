import React, { useEffect, useRef } from 'react';
import { GameDisplay } from '../components/GameDisplay';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCalculator } from '../hooks/useCalculator';
import { useAppNavigation, useAppGame } from '../hooks/useAppState';
import { useGameInputHandlers } from '../hooks/useGameInputHandlers';
import type { WinOption, DifficultyMode, TimeUpOption } from '../../shared/types/navigation';
import { DIFFICULTY_OPTIONS, GAME_START_DELAY } from '../constants/navigation';
import { createDelayedAction } from '../utils/transitions';

export const GameScreen: React.FC = () => {
  const { navigation, setScreen, setDifficulty, setTransition } = useAppNavigation();
  const { game, setGameStartVisible, setGameStarted, setGameInitialized } = useAppGame();
  const { registerHandlers, unregisterHandlers } = useGameInputHandlers();
  const initializationStarted = useRef(false);

  // Game logic hook
  const gameLogicResult = useGameLogic({
    difficulty: navigation.selectedDifficulty ?? 'easy',
    onGameEnd: (_finalScore, _won) => {
      // Win display will be handled automatically by the game logic
    },
    onWinOptionSelect: (option: WinOption, currentDifficulty: DifficultyMode) => {
      
      switch (option) {
        case 'NEXT_DIFFICULTY': {
          // Move to next difficulty level
          const currentIndex = DIFFICULTY_OPTIONS.indexOf(currentDifficulty);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex < DIFFICULTY_OPTIONS.length) {
            // Advance to next difficulty and start game immediately
            const nextDifficulty = DIFFICULTY_OPTIONS[nextIndex];
            if (nextDifficulty) {
              setDifficulty(nextDifficulty);
            
            // Reset and restart game with new difficulty
            gameLogicResult.resetGame();
            clearCalculatorRef.current(); // Clear calculator state
            initializationStarted.current = false;
            setGameStartVisible(true);
            setGameStarted(false);
            
              // Show "GAME START" message and restart with new difficulty
              createDelayedAction(() => {
                setGameStartVisible(false);
                gameLogicResult.initializeGame();
                setGameStarted(true);
              }, setTransition, GAME_START_DELAY);
            }
          } else {
            // Player has completed all difficulties - go to main menu
            setScreen('MAIN_MENU');
            gameLogicResult.resetGame();
            clearCalculatorRef.current(); // Clear calculator state
            setGameStarted(false);
            initializationStarted.current = false;
          }
          break;
        }
        
        case 'SAME_DIFFICULTY':
          // Restart the same difficulty
          setGameStartVisible(true);
          setGameStarted(false);
          gameLogicResult.resetGame();
          clearCalculatorRef.current(); // Clear calculator state
          initializationStarted.current = false;
          
          // Show "GAME START" message and restart
          createDelayedAction(() => {
            setGameStartVisible(false);
            gameLogicResult.initializeGame();
            setGameStarted(true);
          }, setTransition, GAME_START_DELAY);
          break;
        
        case 'GO_HOME':
          // Return to main menu
          setScreen('MAIN_MENU');
          gameLogicResult.resetGame();
          clearCalculatorRef.current(); // Clear calculator state
          setGameStarted(false);
          initializationStarted.current = false;
          break;
      }
    },
    onTimeUpOptionSelect: (option: TimeUpOption, currentDifficulty: DifficultyMode) => {
      switch (option) {
        case 'TRY_AGAIN':
          // Restart the same difficulty
          setGameStartVisible(true);
          setGameStarted(false);
          gameLogicResult.resetGame();
          clearCalculatorRef.current(); // Clear calculator state
          initializationStarted.current = false;
          
          // Show "GAME START" message and restart
          createDelayedAction(() => {
            setGameStartVisible(false);
            gameLogicResult.initializeGame();
            setGameStarted(true);
          }, setTransition, GAME_START_DELAY);
          break;
        
        case 'EASIER_DIFFICULTY': {
          // Move to easier difficulty level
          const currentIndex = DIFFICULTY_OPTIONS.indexOf(currentDifficulty);
          const easierIndex = currentIndex - 1;
          
          if (easierIndex >= 0) {
            // Move to easier difficulty and start game immediately
            const easierDifficulty = DIFFICULTY_OPTIONS[easierIndex];
            if (easierDifficulty) {
              setDifficulty(easierDifficulty);
            
              // Reset and restart game with easier difficulty
              gameLogicResult.resetGame();
              clearCalculatorRef.current(); // Clear calculator state
              initializationStarted.current = false;
              setGameStartVisible(true);
              setGameStarted(false);
              
              // Show "GAME START" message and restart with easier difficulty
              createDelayedAction(() => {
                setGameStartVisible(false);
                gameLogicResult.initializeGame();
                setGameStarted(true);
              }, setTransition, GAME_START_DELAY);
            }
          } else {
            // Already on easiest difficulty - just restart
            setGameStartVisible(true);
            setGameStarted(false);
            gameLogicResult.resetGame();
            clearCalculatorRef.current(); // Clear calculator state
            initializationStarted.current = false;
            
            createDelayedAction(() => {
              setGameStartVisible(false);
              gameLogicResult.initializeGame();
              setGameStarted(true);
            }, setTransition, GAME_START_DELAY);
          }
          break;
        }
        
        case 'GO_HOME':
          // Return to main menu
          setScreen('MAIN_MENU');
          gameLogicResult.resetGame();
          clearCalculatorRef.current(); // Clear calculator state
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

  // Extract values to avoid linting issues
  const { isInitialized, initializeGame } = gameLogicResult;
  
  // Use ref to store clear function to avoid dependency issues
  const clearCalculatorRef = useRef(calculatorResult.clear);
  clearCalculatorRef.current = calculatorResult.clear;

  // Initialize game when screen becomes active
  useEffect(() => {
    if (!isInitialized && !initializationStarted.current) {
      initializationStarted.current = true;
      setGameStartVisible(true);
      setGameStarted(false);
      
      // Show "GAME START" message for specified delay
      const timer = createDelayedAction(() => {
        setGameStartVisible(false);
        clearCalculatorRef.current(); // Clear calculator state before initializing
        initializeGame();
        setGameStarted(true);
        setGameInitialized(true);
      }, setTransition, GAME_START_DELAY);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isInitialized, initializeGame, setGameStartVisible, setGameStarted, setGameInitialized, setTransition]);

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
    if (!gameLogicResult.gameState) {
      return (
        <div className="text-center">
          <div className="lcd-text">Loading game...</div>
        </div>
      );
    }

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
        
        // Check if we're in time-up display mode
        if (gameLogicResult.gameState?.gameStatus === 'timeup' && gameLogicResult.gameState?.showTimeUpDisplay) {
          // Route to time-up display navigation
          const handled = gameLogicResult.handleTimeUpDisplayInput(buttonId);
          if (handled) return true;
        }
        
        // Normal game button handling
        if (!gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing') return false;
        calculatorResult.handleButtonPress(buttonId);
        return true;
      },
      isGameActive: Boolean(!game.showGameStart && game.gameStarted && gameLogicResult.gameState && gameLogicResult.gameState.gameStatus === 'playing'),
      isWinDisplay: Boolean(gameLogicResult.gameState?.gameStatus === 'won' && gameLogicResult.gameState?.showWinDisplay),
      isTimeUpDisplay: Boolean(gameLogicResult.gameState?.gameStatus === 'timeup' && gameLogicResult.gameState?.showTimeUpDisplay),
    };

    registerHandlers(handlers);

    return () => {
      unregisterHandlers();
    };
  }, [calculatorResult, gameLogicResult, game.showGameStart, game.gameStarted, registerHandlers, unregisterHandlers]);

  // Render the appropriate game phase
  if (game.showGameStart) {
    return <GameStartMessage />;
  }

  return <GameInterface />;
}; 