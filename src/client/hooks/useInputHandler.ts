import { useCallback } from 'react';
import { useAppNavigation, useAppGame } from './useAppState';
import { useGameInputHandlers } from './useGameInputHandlers';
import type { MenuOption, DifficultyMode } from '../../shared/types/navigation';

type InputHandler = (buttonId: string) => boolean;

const MENU_OPTIONS: MenuOption[] = ['PLAY', 'HOW TO PLAY', 'LEADERBOARD'];
const DIFFICULTY_OPTIONS: DifficultyMode[] = ['easy', 'medium', 'hard', 'hardcore', 'godtier'];

export const useInputHandler = () => {
  const { navigation, setScreen, setMenuOption, setDifficulty, setTransition, setBackButton } = useAppNavigation();
  const { game } = useAppGame();
  const { getHandlers } = useGameInputHandlers();

  // Navigation input handler for menu screens using AppContext
  const handleNavigationInput: InputHandler = useCallback((buttonId: string) => {
    console.log('Navigation button press:', buttonId, 'on screen:', navigation.currentScreen);
    
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
        setTransition(true);
        setTimeout(() => setTransition(false), 300);
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
        setTransition(true);
        setTimeout(() => setTransition(false), 300);
      }
    };

    // Helper function to handle selection
    const handleSelect = () => {
      if (navigation.currentScreen === 'MAIN_MENU') {
        setTransition(true);
        
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
        
        setTimeout(() => setTransition(false), 300);
      } else if (navigation.currentScreen === 'DIFFICULTY_SELECTION' && navigation.selectedDifficulty) {
        setTransition(true);
        setScreen('GAME');
        setBackButton(true);
        setTimeout(() => setTransition(false), 300);
      }
    };

    // Helper function to handle back navigation
    const handleBack = () => {
      if (navigation.showBackButton) {
        setTransition(true);
        setScreen('MAIN_MENU');
        setBackButton(false);
        setTimeout(() => setTransition(false), 300);
      }
    };

    // Map calculator buttons to navigation actions
    switch (buttonId) {
      case 'add': // + button for UP navigation
      case '8': // Alternative: 8 button for UP
        navigateMenu('UP');
        break;
      
      case 'subtract': // - button for DOWN navigation
      case '2': // Alternative: 2 button for DOWN
        navigateMenu('DOWN');
        break;
      
      case 'equals': // = button for SELECT
      case '5': // Alternative: 5 button for SELECT (center)
        handleSelect();
        break;
      
      case 'delete': // Delete button for BACK
      case '4': // Alternative: 4 button for BACK (left)
        handleBack();
        break;

      // Number shortcuts for direct menu selection
      case '1':
        if (navigation.currentScreen === 'MAIN_MENU') {
          setMenuOption('PLAY');
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '3':
        if (navigation.currentScreen === 'MAIN_MENU') {
          setMenuOption('HOW TO PLAY');
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '6':
        if (navigation.currentScreen === 'MAIN_MENU') {
          setMenuOption('LEADERBOARD');
          setTimeout(() => handleSelect(), 100);
        }
        break;

      // Difficulty shortcuts
      case '7':
        if (navigation.currentScreen === 'DIFFICULTY_SELECTION') {
          setDifficulty('easy');
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '9':
        if (navigation.currentScreen === 'DIFFICULTY_SELECTION') {
          setDifficulty('medium');
          setTimeout(() => handleSelect(), 100);
        }
        break;

      default:
        console.log('Unmapped calculator button for navigation:', buttonId);
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
        
        if (isGameActive || isWinDisplay) {
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
      console.log('Input disabled for current state');
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