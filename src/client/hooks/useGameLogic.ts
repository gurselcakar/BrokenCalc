import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState } from '../../shared/types/game';
import type { DifficultyMode } from '../../shared/types/navigation';
import { generateButtonMapping } from '../utils/buttonScrambler';
import { generateProblem, validateEquation } from '../utils/problemGenerator';

interface UseGameLogicProps {
  difficulty: DifficultyMode;
  onGameEnd?: (finalScore: number, won: boolean) => void;
}

export const useGameLogic = ({ difficulty, onGameEnd }: UseGameLogicProps) => {
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
    resetGame,
  };
};