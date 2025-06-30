// Navigation and screen management types for BrokenCalc home screen

export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'hardcore' | 'godtier';

export type MenuOption = 'PLAY' | 'HOW TO PLAY' | 'LEADERBOARD';

export type ScreenState = 
  | 'WELCOME' 
  | 'MAIN_MENU' 
    | 'DIFFICULTY_SELECTION' 
  | 'GAME'
  | 'WIN_DISPLAY'
  | 'HOW_TO_PLAY' 
  | 'LEADERBOARD';

export type InputMethod = 'TOUCH' | 'MOUSE' | 'KEYBOARD';

export type NavigationAction = 'UP' | 'DOWN' | 'SELECT' | 'BACK';

export type WinOption = 'NEXT_DIFFICULTY' | 'SAME_DIFFICULTY' | 'GO_HOME';

export interface HomeScreenState {
  currentScreen: ScreenState;
  selectedMenuOption: MenuOption;
  selectedDifficulty: DifficultyMode | null;
  showBackButton: boolean;
  isTransitioning: boolean;
  scrollPosition: number;
  maxScrollPosition: number;
  isScrolling: boolean;
}

export interface WelcomeState {
  username: string | null;
  isVisible: boolean;
  transitionDelay: number;
}

export interface NavigationState {
  currentScreen: ScreenState;
  selectedOption: MenuOption | DifficultyMode;
  screenHistory: ScreenState[];
  inputMethod: InputMethod;
}