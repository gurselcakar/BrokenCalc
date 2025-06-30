import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { AppContextType } from '../../shared/types/app';

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks for specific parts of the state
export const useAppNavigation = () => {
  const { state, actions } = useAppContext();
  return {
    navigation: state.navigation,
    setScreen: actions.setScreen,
    setMenuOption: actions.setMenuOption,
    setDifficulty: actions.setDifficulty,
    setTransition: actions.setTransition,
    setScrollPosition: actions.setScrollPosition,
    setScrollBounds: actions.setScrollBounds,
    setBackButton: actions.setBackButton,
  };
};

export const useAppWelcome = () => {
  const { state, actions } = useAppContext();
  return {
    welcome: state.welcome,
    setWelcomeVisible: actions.setWelcomeVisible,
    setWelcomeUsername: actions.setWelcomeUsername,
  };
};

export const useAppGame = () => {
  const { state, actions } = useAppContext();
  return {
    game: state.game,
    setGameStartVisible: actions.setGameStartVisible,
    setGameStarted: actions.setGameStarted,
    setGameState: actions.setGameState,
    setGameInitialized: actions.setGameInitialized,
  };
};

export const useAppUser = () => {
  const { state, actions } = useAppContext();
  return {
    user: state.user,
    setUsername: actions.setUsername,
  };
}; 