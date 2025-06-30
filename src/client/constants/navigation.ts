import type { MenuOption, DifficultyMode } from '../../shared/types/navigation';

// Menu and difficulty option arrays - centralized to avoid duplication
export const MENU_OPTIONS: MenuOption[] = ['PLAY', 'HOW TO PLAY', 'LEADERBOARD'];
export const DIFFICULTY_OPTIONS: DifficultyMode[] = ['easy', 'medium', 'hard', 'hardcore', 'godtier'];

// Menu labels for display - centralized to avoid duplication
export const MENU_LABELS: Record<MenuOption, string> = {
  PLAY: 'PLAY',
  'HOW TO PLAY': 'HOW TO PLAY',
  LEADERBOARD: 'LEADERBOARD',
};

// Timing constants
export const TRANSITION_DELAY = 300;
export const WELCOME_DELAY = 1500;
export const GAME_START_DELAY = 2000; // 2 seconds for "GAME START" message display
export const WIN_FEEDBACK_DELAY = 1500; // 1.5 seconds to show "CORRECT!" before win display
export const TIMEUP_FEEDBACK_DELAY = 1500; // 1.5 seconds to show "TIME UP!" before time-up display 