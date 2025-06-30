import React, { createContext, useReducer, useMemo } from 'react';
import type { AppState, AppAction, AppActions, AppContextType } from '../../shared/types/app';
import type { DifficultyMode, MenuOption, ScreenState } from '../../shared/types/navigation';
import type { GameState } from '../../shared/types/game';
import { WELCOME_DELAY } from '../constants/navigation';

// Initial state
const initialState: AppState = {
  navigation: {
    currentScreen: 'WELCOME',
    selectedMenuOption: 'PLAY',
    selectedDifficulty: null,
    showBackButton: false,
    isTransitioning: false,
    scrollPosition: 0,
    maxScrollPosition: 0,
    isScrolling: false,
  },
  welcome: {
    username: null,
    isVisible: true,
    transitionDelay: WELCOME_DELAY,
  },
  game: {
    showGameStart: false,
    gameStarted: false,
    gameState: null,
    isInitialized: false,
  },
  user: {
    username: null,
  },
};

// App reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Navigation actions
    case 'SET_SCREEN':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentScreen: action.payload,
        },
      };
    
    case 'SET_MENU_OPTION':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          selectedMenuOption: action.payload,
        },
      };
    
    case 'SET_DIFFICULTY':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          selectedDifficulty: action.payload,
        },
      };
    
    case 'SET_TRANSITION':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          isTransitioning: action.payload,
        },
      };
    
    case 'SET_SCROLL_POSITION':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          scrollPosition: action.payload,
        },
      };
    
    case 'SET_SCROLL_BOUNDS':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          maxScrollPosition: action.payload,
        },
      };
    
    case 'SET_BACK_BUTTON':
      return {
        ...state,
        navigation: {
          ...state.navigation,
          showBackButton: action.payload,
        },
      };
    
    // Welcome actions
    case 'SET_WELCOME_VISIBLE':
      return {
        ...state,
        welcome: {
          ...state.welcome,
          isVisible: action.payload,
        },
      };
    
    case 'SET_WELCOME_USERNAME':
      return {
        ...state,
        welcome: {
          ...state.welcome,
          username: action.payload,
        },
      };
    
    // Game actions
    case 'SET_GAME_START_VISIBLE':
      return {
        ...state,
        game: {
          ...state.game,
          showGameStart: action.payload,
        },
      };
    
    case 'SET_GAME_STARTED':
      return {
        ...state,
        game: {
          ...state.game,
          gameStarted: action.payload,
        },
      };
    
    case 'SET_GAME_STATE':
      return {
        ...state,
        game: {
          ...state.game,
          gameState: action.payload,
        },
      };
    
    case 'SET_GAME_INITIALIZED':
      return {
        ...state,
        game: {
          ...state.game,
          isInitialized: action.payload,
        },
      };
    
    // User actions
    case 'SET_USERNAME':
      return {
        ...state,
        user: {
          ...state.user,
          username: action.payload,
        },
        welcome: {
          ...state.welcome,
          username: action.payload,
        },
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | null>(null);

// Export context for hooks
export { AppContext };

// Provider component
export const AppProvider: React.FC<{ 
  children: React.ReactNode;
  initialUsername?: string | null;
}> = ({ children, initialUsername }) => {
  // Initialize state with username if provided
  const stateWithUsername = useMemo(() => ({
    ...initialState,
    user: { username: initialUsername || null },
    welcome: { ...initialState.welcome, username: initialUsername || null },
  }), [initialUsername]);

  const [state, dispatch] = useReducer(appReducer, stateWithUsername);

  // Action creators for better ergonomics
  const actions: AppActions = useMemo(() => ({
    // Navigation actions
    setScreen: (screen: ScreenState) => dispatch({ type: 'SET_SCREEN', payload: screen }),
    setMenuOption: (option: MenuOption) => dispatch({ type: 'SET_MENU_OPTION', payload: option }),
    setDifficulty: (difficulty: DifficultyMode) => dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    setTransition: (isTransitioning: boolean) => dispatch({ type: 'SET_TRANSITION', payload: isTransitioning }),
    setScrollPosition: (position: number) => dispatch({ type: 'SET_SCROLL_POSITION', payload: position }),
    setScrollBounds: (maxPosition: number) => dispatch({ type: 'SET_SCROLL_BOUNDS', payload: maxPosition }),
    setBackButton: (show: boolean) => dispatch({ type: 'SET_BACK_BUTTON', payload: show }),
    
    // Welcome actions
    setWelcomeVisible: (visible: boolean) => dispatch({ type: 'SET_WELCOME_VISIBLE', payload: visible }),
    setWelcomeUsername: (username: string | null) => dispatch({ type: 'SET_WELCOME_USERNAME', payload: username }),
    
    // Game actions
    setGameStartVisible: (visible: boolean) => dispatch({ type: 'SET_GAME_START_VISIBLE', payload: visible }),
    setGameStarted: (started: boolean) => dispatch({ type: 'SET_GAME_STARTED', payload: started }),
    setGameState: (gameState: GameState | null) => dispatch({ type: 'SET_GAME_STATE', payload: gameState }),
    setGameInitialized: (initialized: boolean) => dispatch({ type: 'SET_GAME_INITIALIZED', payload: initialized }),
    
    // User actions
    setUsername: (username: string | null) => dispatch({ type: 'SET_USERNAME', payload: username }),
  }), []);

  const contextValue: AppContextType = useMemo(() => ({
    state,
    dispatch,
    actions,
  }), [state, actions]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context - moved to useAppState.ts

 