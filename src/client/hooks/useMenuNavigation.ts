import { useState, useEffect, useCallback } from 'react';
import type { 
  ScreenState, 
  MenuOption, 
  DifficultyMode, 
  HomeScreenState, 
  InputMethod,
  NavigationAction 
} from '../../shared/types/navigation';

const MENU_OPTIONS: MenuOption[] = ['PLAY', 'HOW TO PLAY', 'LEADERBOARD'];
const DIFFICULTY_OPTIONS: DifficultyMode[] = ['easy', 'medium', 'hard', 'hardcore', 'godtier'];

export const useMenuNavigation = () => {
  const [state, setState] = useState<HomeScreenState>({
    currentScreen: 'WELCOME',
    selectedMenuOption: 'PLAY',
    selectedDifficulty: null,
    showBackButton: false,
    isTransitioning: false,
  });

  const [inputMethod, setInputMethod] = useState<InputMethod>('TOUCH');
  const [screenHistory, setScreenHistory] = useState<ScreenState[]>(['WELCOME']);

  // Detect input method
  useEffect(() => {
    const handleMouseMove = () => setInputMethod('MOUSE');
    const handleTouchStart = () => setInputMethod('TOUCH');
    const handleKeyDown = () => setInputMethod('KEYBOARD');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Navigate between menu options
  const navigateMenu = useCallback((direction: 'UP' | 'DOWN') => {
    setState(prev => {
      if (prev.currentScreen === 'MAIN_MENU') {
        const currentIndex = MENU_OPTIONS.indexOf(prev.selectedMenuOption);
        let newIndex;
        
        if (direction === 'UP') {
          newIndex = currentIndex === 0 ? MENU_OPTIONS.length - 1 : currentIndex - 1;
        } else {
          newIndex = currentIndex === MENU_OPTIONS.length - 1 ? 0 : currentIndex + 1;
        }
        
        return {
          ...prev,
          selectedMenuOption: MENU_OPTIONS[newIndex],
          isTransitioning: true,
        };
      } else if (prev.currentScreen === 'DIFFICULTY_SELECTION') {
        const currentIndex = prev.selectedDifficulty 
          ? DIFFICULTY_OPTIONS.indexOf(prev.selectedDifficulty)
          : 0;
        let newIndex;
        
        if (direction === 'UP') {
          newIndex = currentIndex === 0 ? DIFFICULTY_OPTIONS.length - 1 : currentIndex - 1;
        } else {
          newIndex = currentIndex === DIFFICULTY_OPTIONS.length - 1 ? 0 : currentIndex + 1;
        }
        
        return {
          ...prev,
          selectedDifficulty: DIFFICULTY_OPTIONS[newIndex],
          isTransitioning: true,
        };
      }
      
      return prev;
    });

    // Reset transition state
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  // Handle selection/confirmation
  const handleSelect = useCallback(() => {
    setState(prev => {
      if (prev.currentScreen === 'MAIN_MENU') {
        if (prev.selectedMenuOption === 'PLAY') {
          setScreenHistory(history => [...history, 'DIFFICULTY_SELECTION']);
          return {
            ...prev,
            currentScreen: 'DIFFICULTY_SELECTION',
            selectedDifficulty: 'easy',
            showBackButton: true,
            isTransitioning: true,
          };
        } else if (prev.selectedMenuOption === 'HOW TO PLAY') {
          setScreenHistory(history => [...history, 'HOW_TO_PLAY']);
          return {
            ...prev,
            currentScreen: 'HOW_TO_PLAY',
            showBackButton: true,
            isTransitioning: true,
          };
        } else if (prev.selectedMenuOption === 'LEADERBOARD') {
          setScreenHistory(history => [...history, 'LEADERBOARD']);
          return {
            ...prev,
            currentScreen: 'LEADERBOARD',
            showBackButton: true,
            isTransitioning: true,
          };
        }
      } else if (prev.currentScreen === 'DIFFICULTY_SELECTION' && prev.selectedDifficulty) {
        setScreenHistory(history => [...history, 'COMING_SOON']);
        return {
          ...prev,
          currentScreen: 'COMING_SOON',
          showBackButton: true,
          isTransitioning: true,
        };
      }
      
      return prev;
    });

    // Reset transition state
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    setState(prev => {
      const newHistory = [...screenHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1] || 'MAIN_MENU';
      
      setScreenHistory(newHistory);
      
      return {
        ...prev,
        currentScreen: previousScreen,
        showBackButton: previousScreen !== 'MAIN_MENU' && previousScreen !== 'WELCOME',
        isTransitioning: true,
      };
    });

    // Reset transition state
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, [screenHistory]);

  // Initialize welcome sequence
  const startWelcomeSequence = useCallback((username?: string) => {
    setState(prev => ({
      ...prev,
      currentScreen: 'WELCOME',
      isTransitioning: true,
    }));

    // Transition to main menu after welcome
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentScreen: 'MAIN_MENU',
        showBackButton: false,
        isTransitioning: true,
      }));
      setScreenHistory(['MAIN_MENU']);
      
      setTimeout(() => {
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    }, 2500);
  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.isTransitioning) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          navigateMenu('UP');
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateMenu('DOWN');
          break;
        case 'Enter':
        case 'ArrowRight':
          event.preventDefault();
          handleSelect();
          break;
        case 'ArrowLeft':
        case 'Escape':
          if (state.showBackButton) {
            event.preventDefault();
            handleBack();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isTransitioning, state.showBackButton, navigateMenu, handleSelect, handleBack]);

  return {
    state,
    inputMethod,
    actions: {
      navigateUp: () => navigateMenu('UP'),
      navigateDown: () => navigateMenu('DOWN'),
      select: handleSelect,
      back: handleBack,
      startWelcomeSequence,
    },
  };
};