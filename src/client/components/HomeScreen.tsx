import React, { useEffect, useRef } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { Calculator } from './Calculator';
import { ScreenRouter } from './ScreenRouter';
import { AppProvider } from '../contexts/AppContext';
import { useAppNavigation, useAppWelcome } from '../hooks/useAppState';
import { useInputHandler } from '../hooks/useInputHandler';
import { WELCOME_DELAY } from '../constants/navigation';
import { createDelayedAction } from '../utils/transitions';

interface HomeScreenProps {
  username?: string | undefined;
}

// Internal component that uses the context
const HomeScreenContent: React.FC = () => {
  const { navigation, setScreen, setTransition } = useAppNavigation();
  const { setWelcomeVisible } = useAppWelcome();
  const { handleButtonPress } = useInputHandler();
  
  // Track if welcome sequence has been initialized to prevent infinite loops
  const welcomeInitialized = useRef(false);

  // Initialize welcome sequence on mount
  useEffect(() => {
    if (!welcomeInitialized.current) {
      welcomeInitialized.current = true;
      
      // Start with welcome screen and transition to main menu after delay
      setScreen('WELCOME');
      
      // After welcome delay, transition to main menu
      createDelayedAction(() => {
        setScreen('MAIN_MENU');
        setWelcomeVisible(false);
      }, setTransition, WELCOME_DELAY);
    }
  }, [setScreen, setTransition, setWelcomeVisible]);

  return (
    <CalculatorDisplay 
      isTransitioning={navigation.isTransitioning}
      calculatorButtons={
        <Calculator 
          onButtonPress={handleButtonPress}
          disabled={false} // Input handler manages disabled state internally
        />
      }
    >
      <ScreenRouter />
    </CalculatorDisplay>
  );
};

// Main HomeScreen component that provides the context
export const HomeScreen: React.FC<HomeScreenProps> = ({ username }) => {
  return (
    <AppProvider initialUsername={username || null}>
      <HomeScreenContent />
    </AppProvider>
  );
}; 