import React, { useEffect, useRef } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { Calculator } from './Calculator';
import { ScreenRouter } from './ScreenRouter';
import { AppProvider } from '../contexts/AppContext';
import { useAppNavigation, useAppWelcome } from '../hooks/useAppState';
import { useInputHandler } from '../hooks/useInputHandler';

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
      
      // Start with welcome screen and transition state
      setScreen('WELCOME');
      setTransition(true);
      
      // After 2.5 seconds, transition to main menu
      setTimeout(() => {
        setScreen('MAIN_MENU');
        setWelcomeVisible(false);
        setTransition(false);
      }, 2500);
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