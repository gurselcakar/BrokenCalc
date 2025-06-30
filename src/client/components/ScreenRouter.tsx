import React from 'react';
import { useAppNavigation } from '../hooks/useAppState';
import {
  WelcomeScreen,
  MainMenuScreen,
  DifficultySelectionScreen,
  GameScreen,
  HowToPlayScreen,
  LeaderboardScreen,
} from '../screens';
import type { ScreenState } from '../../shared/types/navigation';

// Screen component mapping - following Open/Closed Principle
const SCREEN_COMPONENTS: Record<ScreenState, React.ComponentType> = {
  WELCOME: WelcomeScreen,
  MAIN_MENU: MainMenuScreen,
  DIFFICULTY_SELECTION: DifficultySelectionScreen,
  GAME: GameScreen,
  HOW_TO_PLAY: HowToPlayScreen,
  LEADERBOARD: LeaderboardScreen,
} as const;

export const ScreenRouter: React.FC = () => {
  const { navigation } = useAppNavigation();
  
  // Get the appropriate screen component
  const ScreenComponent = SCREEN_COMPONENTS[navigation.currentScreen];
  
  // Fallback to main menu if screen not found
  if (!ScreenComponent) {
    console.warn(`Unknown screen: ${navigation.currentScreen}, falling back to MAIN_MENU`);
    const FallbackComponent = SCREEN_COMPONENTS.MAIN_MENU;
    return <FallbackComponent />;
  }
  
  return <ScreenComponent />;
}; 