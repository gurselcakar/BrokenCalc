// Navigation and screen management types for BrokenCalc home screen

export type DifficultyMode = 'easy' | 'medium' | 'hard' | 'hardcore' | 'godtier';

export type MenuOption = 'PLAY' | 'HOW TO PLAY' | 'LEADERBOARD';

export type ScreenState = 
  | 'WELCOME' 
  | 'MAIN_MENU' 
  | 'DIFFICULTY_SELECTION' 
  | 'GAME'
  | 'HOW_TO_PLAY' 
  | 'LEADERBOARD';

export type WinOption = 'NEXT_DIFFICULTY' | 'SAME_DIFFICULTY' | 'GO_HOME';
export type TimeUpOption = 'TRY_AGAIN' | 'EASIER_DIFFICULTY' | 'GO_HOME';

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

