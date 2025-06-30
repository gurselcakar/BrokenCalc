import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState } from '../../shared/types/game';
import type { DifficultyMode, WinOption } from '../../shared/types/navigation';
import { generateButtonMapping } from '../utils/buttonScrambler';
import { generateProblem, validateEquation } from '../utils/problemGenerator';

interface UseGameLogicProps {
  difficulty: DifficultyMode;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  onWinOptionSelect?: (option: WinOption, currentDifficulty: DifficultyMode) => void;
}

const WIN_OPTIONS: WinOption[] = ['NEXT_DIFFICULTY', 'SAME_DIFFICULTY', 'GO_HOME'];

export const useGameLogic = ({ difficulty, onGameEnd, onWinOptionSelect }: UseGameLogicProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize game
  const initializeGame = useCallback(() => {
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
    };

    setGameState(newGameState);
    setIsInitialized(true);
    
    console.log('Game initialized:', {
      difficulty,
      problem: problem.equation,
      solutions: problem.possibleSolutions,
      buttonMapping,
    });
  }, [difficulty]);

  // Start countdown timer
  useEffect(() => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.gameStatus !== 'playing') return prev;

        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          // Time's up!
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

  // Handle equation completion from calculator
  const handleEquationComplete = useCallback((equation: string, result: number) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    console.log('Equation completed:', equation, '=', result);
    console.log('Target value:', gameState.problem.targetValue);
    console.log('Possible solutions:', gameState.problem.possibleSolutions);

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
      }, 1500); // Show CORRECT! for 1.5 seconds

      onGameEnd?.(finalScore, true);
      
      console.log('Victory! Final score:', finalScore);
    } else {
      // Wrong answer - show feedback
      console.log('Incorrect answer');
      
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
    resetGame,
  };
};