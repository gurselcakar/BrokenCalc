import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  ScreenState, 
  MenuOption, 
  DifficultyMode, 
  HomeScreenState, 
  InputMethod,
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
    scrollPosition: 0,
    maxScrollPosition: 0,
    isScrolling: false,
  });

  const [inputMethod, setInputMethod] = useState<InputMethod>('TOUCH');
  
  // Use ref to avoid dependency issues with screenHistory
  const screenHistoryRef = useRef<ScreenState[]>(['WELCOME']);

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

  // Scroll content when overflow detected
  const scrollContent = useCallback((direction: 'UP' | 'DOWN') => {
    setState(prev => {
      if (direction === 'UP' && prev.scrollPosition > 0) {
        return {
          ...prev,
          scrollPosition: prev.scrollPosition - 1,
          isScrolling: true,
        };
      } else if (direction === 'DOWN' && prev.scrollPosition < prev.maxScrollPosition) {
        return {
          ...prev,
          scrollPosition: prev.scrollPosition + 1,
          isScrolling: true,
        };
      }
      return prev;
    });

    // Reset scrolling state
    setTimeout(() => {
      setState(prev => ({ ...prev, isScrolling: false }));
    }, 100);
  }, []);

  // Set scroll bounds for content
  const setScrollBounds = useCallback((maxScroll: number) => {
    setState(prev => ({
      ...prev,
      maxScrollPosition: Math.max(0, maxScroll),
      scrollPosition: Math.min(prev.scrollPosition, maxScroll),
    }));
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
          selectedMenuOption: MENU_OPTIONS[newIndex] || 'PLAY',
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
          selectedDifficulty: DIFFICULTY_OPTIONS[newIndex] || 'easy',
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

  // Check if current screen has scrollable content
  const hasScrollableContent = useCallback((screen: ScreenState) => {
    return screen === 'HOW_TO_PLAY' || screen === 'LEADERBOARD';
  }, []);

  // Handle navigation (either scroll or menu navigation)
  const handleNavigation = useCallback((direction: 'UP' | 'DOWN') => {
    const isScrollableScreen = hasScrollableContent(state.currentScreen);
    const hasScroll = state.maxScrollPosition > 0;
    
    console.log('Navigation attempt:', {
      direction,
      currentScreen: state.currentScreen,
      isScrollableScreen,
      maxScrollPosition: state.maxScrollPosition,
      hasScroll,
      willScroll: isScrollableScreen && hasScroll
    });
    
    if (isScrollableScreen && hasScroll) {
      console.log('Using scroll navigation');
      scrollContent(direction);
    } else {
      console.log('Using menu navigation');
      navigateMenu(direction);
    }
  }, [state.currentScreen, state.maxScrollPosition, scrollContent, navigateMenu, hasScrollableContent]);

  // Handle selection/confirmation
  const handleSelect = useCallback(() => {
    setState(prev => {
      if (prev.currentScreen === 'MAIN_MENU') {
        if (prev.selectedMenuOption === 'PLAY') {
          screenHistoryRef.current = [...screenHistoryRef.current, 'DIFFICULTY_SELECTION'];
          return {
            ...prev,
            currentScreen: 'DIFFICULTY_SELECTION',
            selectedDifficulty: 'easy',
            showBackButton: true,
            isTransitioning: true,
            scrollPosition: 0,
            maxScrollPosition: 0,
          };
        } else if (prev.selectedMenuOption === 'HOW TO PLAY') {
          screenHistoryRef.current = [...screenHistoryRef.current, 'HOW_TO_PLAY'];
          return {
            ...prev,
            currentScreen: 'HOW_TO_PLAY',
            showBackButton: true,
            isTransitioning: true,
            scrollPosition: 0,
            maxScrollPosition: 0,
          };
        } else if (prev.selectedMenuOption === 'LEADERBOARD') {
          screenHistoryRef.current = [...screenHistoryRef.current, 'LEADERBOARD'];
          return {
            ...prev,
            currentScreen: 'LEADERBOARD',
            showBackButton: true,
            isTransitioning: true,
            scrollPosition: 0,
            maxScrollPosition: 0,
          };
        }
      } else if (prev.currentScreen === 'DIFFICULTY_SELECTION' && prev.selectedDifficulty) {
        screenHistoryRef.current = [...screenHistoryRef.current, 'GAME'];
        return {
          ...prev,
          currentScreen: 'GAME',
          showBackButton: true,
          isTransitioning: true,
          scrollPosition: 0,
          maxScrollPosition: 0,
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
      const newHistory = [...screenHistoryRef.current];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1] || 'MAIN_MENU';
      
      screenHistoryRef.current = newHistory;
      
      return {
        ...prev,
        currentScreen: previousScreen,
        showBackButton: previousScreen !== 'MAIN_MENU' && previousScreen !== 'WELCOME',
        isTransitioning: true,
        scrollPosition: 0,
        maxScrollPosition: 0,
      };
    });

    // Reset transition state
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  // NEW: Handle calculator button input for navigation
  const handleCalculatorButtonInput = useCallback((buttonId: string) => {
    if (state.isTransitioning) return;

    console.log('Calculator button pressed for navigation:', buttonId, 'on screen:', state.currentScreen);

    // Map calculator buttons to navigation actions
    switch (buttonId) {
      case 'subtract': // - button for UP navigation
      case '8': // Alternative: 8 button for UP
        handleNavigation('UP');
        break;
      
      case 'add': // + button for DOWN navigation  
      case '2': // Alternative: 2 button for DOWN
        handleNavigation('DOWN');
        break;
      
      case 'equals': // = button for SELECT
      case '5': // Alternative: 5 button for SELECT (center)
        handleSelect();
        break;
      
      case 'delete': // Delete button for BACK
      case '4': // Alternative: 4 button for BACK (left)
        if (state.showBackButton) {
          handleBack();
        }
        break;

      // Number shortcuts for direct menu selection
      case '1':
        if (state.currentScreen === 'MAIN_MENU') {
          setState(prev => ({ ...prev, selectedMenuOption: 'PLAY' }));
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '3':
        if (state.currentScreen === 'MAIN_MENU') {
          setState(prev => ({ ...prev, selectedMenuOption: 'HOW TO PLAY' }));
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '6':
        if (state.currentScreen === 'MAIN_MENU') {
          setState(prev => ({ ...prev, selectedMenuOption: 'LEADERBOARD' }));
          setTimeout(() => handleSelect(), 100);
        }
        break;

      // Difficulty shortcuts
      case '7':
        if (state.currentScreen === 'DIFFICULTY_SELECTION') {
          setState(prev => ({ ...prev, selectedDifficulty: 'easy' }));
          setTimeout(() => handleSelect(), 100);
        }
        break;
      
      case '9':
        if (state.currentScreen === 'DIFFICULTY_SELECTION') {
          setState(prev => ({ ...prev, selectedDifficulty: 'medium' }));
          setTimeout(() => handleSelect(), 100);
        }
        break;

      default:
        console.log('Unmapped calculator button for navigation:', buttonId);
        break;
    }
  }, [state.isTransitioning, state.showBackButton, state.currentScreen, handleNavigation, handleSelect, handleBack]);

  // Initialize welcome sequence
  const startWelcomeSequence = useCallback(() => {
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
      screenHistoryRef.current = ['MAIN_MENU'];
      
      setTimeout(() => {
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, 300);
    }, 2500);
  }, []);

  // Keyboard event handler - Updated to work alongside calculator buttons
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (state.isTransitioning) return;

      // Only handle keyboard events if we're not in game mode
      if (state.currentScreen === 'GAME') return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          handleNavigation('UP');
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleNavigation('DOWN');
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
  }, [state.isTransitioning, state.showBackButton, state.currentScreen, handleNavigation, handleSelect, handleBack]);

  // Set screen directly
  const setScreen = useCallback((screen: ScreenState) => {
    setState(prev => ({
      ...prev,
      currentScreen: screen,
      showBackButton: screen !== 'MAIN_MENU' && screen !== 'WELCOME',
      isTransitioning: true,
      scrollPosition: 0,
      maxScrollPosition: 0,
    }));

    // Reset transition state
    setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 300);
  }, []);

  return {
    state,
    inputMethod,
    actions: {
      navigateUp: () => handleNavigation('UP'),
      navigateDown: () => handleNavigation('DOWN'),
      select: handleSelect,
      back: handleBack,
      startWelcomeSequence,
      setScrollBounds,
      scrollUp: () => scrollContent('UP'),
      scrollDown: () => scrollContent('DOWN'),
      setScreen,
      handleCalculatorButtonInput, // NEW: Expose calculator button handler
    },
  };
};