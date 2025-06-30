import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState } from '../../shared/types/game';
import type { DifficultyMode, WinOption, TimeUpOption } from '../../shared/types/navigation';
import { generateButtonMapping } from '../utils/buttonScrambler';
import { generateProblem, validateEquation } from '../utils/problemGenerator';
import { WIN_FEEDBACK_DELAY, TIMEUP_FEEDBACK_DELAY } from '../constants/navigation';

interface UseGameLogicProps {
  difficulty: DifficultyMode;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  onWinOptionSelect?: (option: WinOption, currentDifficulty: DifficultyMode) => void;
  onTimeUpOptionSelect?: (option: TimeUpOption, currentDifficulty: DifficultyMode) => void;
}

const WIN_OPTIONS: WinOption[] = ['NEXT_DIFFICULTY', 'SAME_DIFFICULTY', 'GO_HOME'];
const TIMEUP_OPTIONS: TimeUpOption[] = ['TRY_AGAIN', 'EASIER_DIFFICULTY', 'GO_HOME'];

export const useGameLogic = ({ difficulty, onGameEnd, onWinOptionSelect, onTimeUpOptionSelect }: UseGameLogicProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize game
  const initializeGame = useCallback(() => {
    try {
      const problem = generateProblem(difficulty);
      const buttonMapping = generateButtonMapping(difficulty);

      const newGameState: GameState = {
        mode: difficulty,
        problem,
        buttonMapping,
        calculatorDisplay: '',
        timeRemaining: 120, // 2 minutes
        gameStatus: 'playing',
        userInput: '',
        showWinDisplay: false,
        selectedWinOption: 'NEXT_DIFFICULTY',
        showTimeUpDisplay: false,
        selectedTimeUpOption: 'TRY_AGAIN',
      };

      setGameState(newGameState);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, [difficulty]);

  // Start countdown timer
  useEffect(() => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.gameStatus !== 'playing') return prev;

        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          // Time's up! Stop timer and show time-up display after delay
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // Show "TIME UP!" for a moment, then transition to time-up display
          setTimeout(() => {
            setGameState(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                showTimeUpDisplay: true,
              };
            });
          }, TIMEUP_FEEDBACK_DELAY);
          
          onGameEnd?.(0, false);
          return {
            ...prev,
            timeRemaining: 0,
            gameStatus: 'timeup',
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, onGameEnd]);

  // Navigate between win options
  const navigateWinOptions = useCallback((direction: 'UP' | 'DOWN') => {
    if (!gameState || gameState.gameStatus !== 'won' || !gameState.showWinDisplay) return;

    setGameState(prev => {
      if (!prev) return prev;

      const currentOption = prev.selectedWinOption || 'NEXT_DIFFICULTY';
      const currentIndex = WIN_OPTIONS.indexOf(currentOption);
      let newIndex;

      if (direction === 'UP') {
        newIndex = currentIndex === 0 ? WIN_OPTIONS.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === WIN_OPTIONS.length - 1 ? 0 : currentIndex + 1;
      }

      const newSelectedOption = WIN_OPTIONS[newIndex];

      return {
        ...prev,
        selectedWinOption: newSelectedOption,
      } as GameState;
    });
  }, [gameState]);

  // Select win option
  const selectWinOption = useCallback(() => {
    if (!gameState || gameState.gameStatus !== 'won' || !gameState.showWinDisplay || !gameState.selectedWinOption) return;

    onWinOptionSelect?.(gameState.selectedWinOption, gameState.mode);
  }, [gameState, onWinOptionSelect]);

  // Navigate between time-up options
  const navigateTimeUpOptions = useCallback((direction: 'UP' | 'DOWN') => {
    if (!gameState || gameState.gameStatus !== 'timeup' || !gameState.showTimeUpDisplay) return;

    setGameState(prev => {
      if (!prev) return prev;

      const currentOption = prev.selectedTimeUpOption || 'TRY_AGAIN';
      const currentIndex = TIMEUP_OPTIONS.indexOf(currentOption);
      let newIndex;

      if (direction === 'UP') {
        newIndex = currentIndex === 0 ? TIMEUP_OPTIONS.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === TIMEUP_OPTIONS.length - 1 ? 0 : currentIndex + 1;
      }

      const newSelectedOption = TIMEUP_OPTIONS[newIndex];

      return {
        ...prev,
        selectedTimeUpOption: newSelectedOption,
      } as GameState;
    });
  }, [gameState]);

  // Select time-up option
  const selectTimeUpOption = useCallback(() => {
    if (!gameState || gameState.gameStatus !== 'timeup' || !gameState.showTimeUpDisplay || !gameState.selectedTimeUpOption) return;

    onTimeUpOptionSelect?.(gameState.selectedTimeUpOption, gameState.mode);
  }, [gameState, onTimeUpOptionSelect]);

  // Handle calculator button input during win display
  const handleWinDisplayInput = useCallback((buttonId: string) => {
    if (!gameState || gameState.gameStatus !== 'won' || !gameState.showWinDisplay) return false;

    switch (buttonId) {
      case 'add': // + for UP
        navigateWinOptions('UP');
        return true;
      case 'subtract': // - for DOWN
        navigateWinOptions('DOWN');
        return true;
      case 'equals': // = for SELECT
        selectWinOption();
        return true;
      default:
        return false;
    }
  }, [gameState, navigateWinOptions, selectWinOption]);

  // Handle calculator button input during time-up display
  const handleTimeUpDisplayInput = useCallback((buttonId: string) => {
    if (!gameState || gameState.gameStatus !== 'timeup' || !gameState.showTimeUpDisplay) return false;

    switch (buttonId) {
      case 'add': // + for UP
        navigateTimeUpOptions('UP');
        return true;
      case 'subtract': // - for DOWN
        navigateTimeUpOptions('DOWN');
        return true;
      case 'equals': // = for SELECT
        selectTimeUpOption();
        return true;
      default:
        return false;
    }
  }, [gameState, navigateTimeUpOptions, selectTimeUpOption]);

  // Handle equation completion from calculator
  const handleEquationComplete = useCallback((equation: string, result: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    // Update game state with result
    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lastResult: result,
        calculatorDisplay: result.toString(),
      };
    });

    // Check if the equation is correct
    const isCorrect = validateEquation(equation, gameState.problem.targetValue);
    
    if (isCorrect) {
      // Victory!
      const finalScore = gameState.timeRemaining;
      
      setGameState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          gameStatus: 'won',
          finalScore,
        };
      });

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Show "CORRECT!" for a moment, then transition to win display
      setTimeout(() => {
        setGameState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            showWinDisplay: true,
          };
        });
      }, WIN_FEEDBACK_DELAY);

      onGameEnd?.(finalScore, true);
    } else {
      // Wrong answer - show feedback
      
      // The feedback will be shown in the GameDisplay component
      // User can continue playing
    }
  }, [gameState, onGameEnd]);

  // Reset game
  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(null);
    setIsInitialized(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    gameState,
    isInitialized,
    initializeGame,
    handleEquationComplete,
    handleWinDisplayInput,
    handleTimeUpDisplayInput,
    resetGame,
  };
};