// Game types and data structures for BrokenCalc

// Import difficulty mode from navigation types
import type { DifficultyMode, WinOption, TimeUpOption } from './navigation';



// Basic response type for API calls
export type ApiResponse<T> = 
  | { status: 'success' } & T
  | { status: 'error'; message: string };

// Game state management
export interface GameState {
  mode: DifficultyMode;
  problem: MathProblem;
  buttonMapping: ButtonMapping;
  calculatorDisplay: string;
  timeRemaining: number; // 120 seconds
  gameStatus: 'starting' | 'playing' | 'won' | 'timeup';
  finalScore?: number; // Set when game ends (remaining seconds)
  userInput: string; // Current equation being built
  lastResult?: number; // Last calculated result
  showResult?: boolean; // Whether to show calculated result
  showWinDisplay?: boolean; // Whether to show win display in LCD
  selectedWinOption?: WinOption; // Currently selected win option
  showTimeUpDisplay?: boolean; // Whether to show time-up display in LCD
  selectedTimeUpOption?: TimeUpOption; // Currently selected time-up option
}

// Math problem structure
export interface MathProblem {
  equation: string; // "_ + _ = 7"
  targetValue: number; // 7
  possibleSolutions: string[]; // ["1+6", "2+5", "3+4", etc.]
  difficulty: DifficultyMode;
}

// Button mapping system with mode-specific logic
export interface ButtonMapping {
  numbers: { [key: string]: string }; // '1' -> '7', '2' -> '0', etc.
  operators: { [key: string]: string }; // '+' -> '×', '-' -> '÷', etc.
  display?: { [key: string]: string }; // For god-tier mode only
}

// Calculator button representation
export interface CalculatorButton {
  id: string; // '1', '2', '+', '-', '=', 'delete'
  displayLabel: string; // What user sees on button
  actualValue: string; // What it actually does when pressed
  type: 'number' | 'operator' | 'action';
  gridPosition: { row: number; col: number; span?: number };
}

// Win display state for LCD
export interface WinDisplayState {
  finalScore: number;
  selectedOption: WinOption;
  currentDifficulty: DifficultyMode;
}

// Game display layout for LCD
export interface GameDisplayState {
  timer: string; // "2:00" format
  equation: string; // "_ + _ = 7"
  userInput: string; // "3+4" as user types
  feedback: string; // "INCORRECT" or empty
  showResult: boolean; // Show calculated result
  result?: number; // Calculated result to display
  winDisplay?: WinDisplayState; // Win display state
}