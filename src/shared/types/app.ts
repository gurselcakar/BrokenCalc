// Application-wide state management types for BrokenCalc

import type { DifficultyMode, MenuOption, ScreenState, WelcomeState, HomeScreenState } from './navigation';
import type { GameState } from './game';

// Consolidated application state
export interface AppState {
  navigation: HomeScreenState;
  welcome: WelcomeState;
  game: {
    showGameStart: boolean;
    gameStarted: boolean;
    gameState: GameState | null;
    isInitialized: boolean;
  };
  user: {
    username?: string | null;
  };
}

// Application action types
export type AppAction =
  // Navigation actions
  | { type: 'SET_SCREEN'; payload: ScreenState }
  | { type: 'SET_MENU_OPTION'; payload: MenuOption }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyMode }
  | { type: 'SET_TRANSITION'; payload: boolean }
  | { type: 'SET_SCROLL_POSITION'; payload: number }
  | { type: 'SET_SCROLL_BOUNDS'; payload: number }
  | { type: 'SET_BACK_BUTTON'; payload: boolean }
  // Welcome actions
  | { type: 'SET_WELCOME_VISIBLE'; payload: boolean }
  | { type: 'SET_WELCOME_USERNAME'; payload: string | null }
  // Game actions
  | { type: 'SET_GAME_START_VISIBLE'; payload: boolean }
  | { type: 'SET_GAME_STARTED'; payload: boolean }
  | { type: 'SET_GAME_STATE'; payload: GameState | null }
  | { type: 'SET_GAME_INITIALIZED'; payload: boolean }
  // User actions
  | { type: 'SET_USERNAME'; payload: string | null };

// Action creators type for better type safety
export interface AppActions {
  // Navigation actions
  setScreen: (screen: ScreenState) => void;
  setMenuOption: (option: MenuOption) => void;
  setDifficulty: (difficulty: DifficultyMode) => void;
  setTransition: (isTransitioning: boolean) => void;
  setScrollPosition: (position: number) => void;
  setScrollBounds: (maxPosition: number) => void;
  setBackButton: (show: boolean) => void;
  // Welcome actions
  setWelcomeVisible: (visible: boolean) => void;
  setWelcomeUsername: (username: string | null) => void;
  // Game actions
  setGameStartVisible: (visible: boolean) => void;
  setGameStarted: (started: boolean) => void;
  setGameState: (gameState: GameState | null) => void;
  setGameInitialized: (initialized: boolean) => void;
  // User actions
  setUsername: (username: string | null) => void;
}

// Context type
export interface AppContextType {
  state: AppState;
  dispatch: (action: AppAction) => void;
  actions: AppActions;
} 