import { useCallback } from 'react';
import { useAppNavigation, useAppGame } from './useAppState';
import { useGameInputHandlers } from './useGameInputHandlers';
import { MENU_OPTIONS, DIFFICULTY_OPTIONS } from '../constants/navigation';
import { createTransitionHandler } from '../utils/transitions';

type InputHandler = (buttonId: string) => boolean;

export const useInputHandler = () => {
  const { navigation, setScreen, setMenuOption, setDifficulty, setTransition, setBackButton } = useAppNavigation();
  const { game } = useAppGame();
  const { getHandlers } = useGameInputHandlers();

  // Navigation input handler for menu screens using AppContext
  const handleNavigationInput: InputHandler = useCallback((buttonId: string) => {
    if (navigation.isTransitioning) return true;

    // Helper function to navigate menu options
    const navigateMenu = (direction: 'UP' | 'DOWN') => {
      if (navigation.currentScreen === 'MAIN_MENU') {
        const currentIndex = MENU_OPTIONS.indexOf(navigation.selectedMenuOption);
        let newIndex;
        
        if (direction === 'UP') {
          newIndex = currentIndex === 0 ? MENU_OPTIONS.length - 1 : currentIndex - 1;
        } else {
          newIndex = currentIndex === MENU_OPTIONS.length - 1 ? 0 : currentIndex + 1;
        }
        
        setMenuOption(MENU_OPTIONS[newIndex] || 'PLAY');
        createTransitionHandler(setTransition);
      } else if (navigation.currentScreen === 'DIFFICULTY_SELECTION') {
        const currentIndex = navigation.selectedDifficulty 
          ? DIFFICULTY_OPTIONS.indexOf(navigation.selectedDifficulty)
          : 0;
        let newIndex;
        
        if (direction === 'UP') {
          newIndex = currentIndex === 0 ? DIFFICULTY_OPTIONS.length - 1 : currentIndex - 1;
        } else {
          newIndex = currentIndex === DIFFICULTY_OPTIONS.length - 1 ? 0 : currentIndex + 1;
        }
        
        setDifficulty(DIFFICULTY_OPTIONS[newIndex] || 'easy');
        createTransitionHandler(setTransition);
      }
    };

    // Helper function to handle selection
    const handleSelect = () => {
      if (navigation.currentScreen === 'MAIN_MENU') {
        if (navigation.selectedMenuOption === 'PLAY') {
          setScreen('DIFFICULTY_SELECTION');
          setDifficulty('easy');
          setBackButton(true);
        } else if (navigation.selectedMenuOption === 'HOW TO PLAY') {
          setScreen('HOW_TO_PLAY');
          setBackButton(true);
        } else if (navigation.selectedMenuOption === 'LEADERBOARD') {
          setScreen('LEADERBOARD');
          setBackButton(true);
        }
        
        createTransitionHandler(setTransition);
      } else if (navigation.currentScreen === 'DIFFICULTY_SELECTION' && navigation.selectedDifficulty) {
        setScreen('GAME');
        setBackButton(true);
        createTransitionHandler(setTransition);
      }
    };

    // Helper function to handle back navigation
    const handleBack = () => {
      if (navigation.showBackButton) {
        setScreen('MAIN_MENU');
        setBackButton(false);
        createTransitionHandler(setTransition);
      }
    };

    // Map calculator buttons to navigation actions
    switch (buttonId) {
      case 'add': // + button for UP navigation
        navigateMenu('UP');
        break;
      
      case 'subtract': // - button for DOWN navigation
        navigateMenu('DOWN');
        break;
      
      case 'equals': // = button for SELECT
        handleSelect();
        break;
      
      case 'delete': // Delete button for BACK
        handleBack();
        break;

      default:
        break;
    }
    
    return true;
  }, [navigation, setScreen, setMenuOption, setDifficulty, setTransition, setBackButton]);

  // Game input handler for game screens
  const handleGameInput: InputHandler = useCallback((buttonId: string) => {
    // Check if game input handlers are available (set by GameScreen)
    const gameHandlers = getHandlers();
    if (gameHandlers && gameHandlers.handleGameButtonPress) {
      return gameHandlers.handleGameButtonPress(buttonId);
    }
    return false;
  }, [getHandlers]);

  // No-op handler for disabled states
  const handleDisabledInput: InputHandler = useCallback(() => {
    return false;
  }, []);

  // Input handler mapping for different screen types
  const getInputHandler = useCallback((): { handler: InputHandler; disabled: boolean } => {
    const currentScreen = navigation.currentScreen;
    
    // Game screen input handling
    if (currentScreen === 'GAME') {
      const gameHandlers = getHandlers();
      
      if (gameHandlers) {
        const isGameActive = gameHandlers.isGameActive;
        const isWinDisplay = gameHandlers.isWinDisplay;
        const isTimeUpDisplay = gameHandlers.isTimeUpDisplay;
        
        if (isGameActive || isWinDisplay || isTimeUpDisplay) {
          return { handler: handleGameInput, disabled: false };
        }
      }
      
      // Game screen but not active (showing start message, loading, etc.)
      return { handler: handleDisabledInput, disabled: true };
    }
    
    // Navigation screens
    if (currentScreen !== 'WELCOME') {
      return { 
        handler: handleNavigationInput, 
        disabled: navigation.isTransitioning 
      };
    }
    
    // Welcome screen or unknown - disabled
    return { handler: handleDisabledInput, disabled: true };
  }, [navigation.currentScreen, navigation.isTransitioning, handleGameInput, handleNavigationInput, handleDisabledInput, getHandlers]);

  // Main button press handler
  const handleButtonPress = useCallback((buttonId: string) => {
    const { handler, disabled } = getInputHandler();
    
    if (disabled) {
      return;
    }
    
    try {
      handler(buttonId);
    } catch (error) {
      console.error('Error handling button press:', error);
    }
  }, [getInputHandler]);

  // Get current input state for debugging/display purposes
  const getInputState = useCallback(() => {
    const { disabled } = getInputHandler();
    return {
      currentScreen: navigation.currentScreen,
      disabled,
      isTransitioning: navigation.isTransitioning,
      isGameActive: navigation.currentScreen === 'GAME' && !game.showGameStart && game.gameStarted,
    };
  }, [navigation.currentScreen, navigation.isTransitioning, game.showGameStart, game.gameStarted, getInputHandler]);

  return {
    handleButtonPress,
    getInputState,
  };
}; 