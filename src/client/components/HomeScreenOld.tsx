import React, { useEffect, useRef } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { WelcomeSequence } from './WelcomeSequence';
import { DifficultySelection } from './DifficultySelection';
import { HowToPlay } from './HowToPlay';
import { Leaderboard } from './Leaderboard';
import { GameDisplay } from './GameDisplay';
import { Calculator } from './Calculator';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCalculator } from '../hooks/useCalculator';
import { useMenuNavigation } from '../hooks/useMenuNavigation';
import { AppProvider } from '../contexts/AppContext';
import { useAppNavigation, useAppWelcome, useAppGame } from '../hooks/useAppState';
import type { MenuOption, DifficultyMode, WinOption } from '../../shared/types/navigation';

interface HomeScreenProps {
  username?: string | undefined;
}

const MENU_LABELS: Record<MenuOption, string> = {
  PLAY: 'PLAY',
  'HOW TO PLAY': 'HOW TO PLAY',
  LEADERBOARD: 'LEADERBOARD',
};

// Internal component that uses the context
const HomeScreenContent: React.FC = () => {
  const { state: navigationState, actions } = useMenuNavigation();
  const { navigation, setScreen, setMenuOption, setDifficulty } = useAppNavigation();
  const { welcome } = useAppWelcome();
  const { game, setGameStartVisible, setGameStarted, setGameInitialized } = useAppGame();
  
  // Track if welcome sequence has been initialized to prevent infinite loops
  const welcomeInitialized = useRef(false);

  // Sync old navigation state with new AppContext state
  useEffect(() => {
    if (navigationState.currentScreen !== navigation.currentScreen) {
      setScreen(navigationState.currentScreen);
    }
    if (navigationState.selectedMenuOption !== navigation.selectedMenuOption) {
      setMenuOption(navigationState.selectedMenuOption);
    }
    if (navigationState.selectedDifficulty !== navigation.selectedDifficulty && navigationState.selectedDifficulty) {
      setDifficulty(navigationState.selectedDifficulty);
    }
  }, [
    navigationState.currentScreen, 
    navigationState.selectedMenuOption, 
    navigationState.selectedDifficulty,
    navigation.currentScreen,
    navigation.selectedMenuOption, 
    navigation.selectedDifficulty,
    setScreen, 
    setMenuOption, 
    setDifficulty
  ]);

  // Game logic hook - only initialize when game screen is active
  const gameLogicResult = useGameLogic({
    difficulty: navigation.selectedDifficulty ?? 'easy',
    onGameEnd: (finalScore, won) => {
      console.log('Game ended:', { finalScore, won });
      // Win display will be handled automatically by the game logic
    },
    onWinOptionSelect: (option: WinOption, currentDifficulty: DifficultyMode) => {
      console.log('Win option selected:', option, 'Current difficulty:', currentDifficulty);
      
      switch (option) {
        case 'NEXT_DIFFICULTY':
          // Move to next difficulty level
          // Navigate to difficulty selection or directly start next game
          actions.setScreen('DIFFICULTY_SELECTION');
          // TODO: Set the next difficulty and start game
          break;
        
        case 'SAME_DIFFICULTY':
          // Restart the same difficulty
          setGameStartVisible(true);
          setGameStarted(false);
          gameLogicResult.resetGame();
          
          // Show "GAME START" message and restart
          setTimeout(() => {
            setGameStartVisible(false);
            gameLogicResult.initializeGame();
            setGameStarted(true);
          }, 2000);
          break;
        
        case 'GO_HOME':
          // Return to main menu
          actions.setScreen('MAIN_MENU');
          gameLogicResult.resetGame();
          setGameStarted(false);
          break;
      }
    },
  });

  // Calculator hook - only initialize when game is active
  const calculatorResult = useCalculator({
    buttonMapping: gameLogicResult.gameState?.buttonMapping || { numbers: {}, operators: {} },
    onEquationComplete: gameLogicResult.handleEquationComplete,
    disabled: !gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing',
  });

  // Initialize welcome sequence on mount
  useEffect(() => {
    if (!welcomeInitialized.current) {
      welcomeInitialized.current = true;
      actions.startWelcomeSequence();
    }
  }, [actions]);

  // Initialize game when GAME screen is shown
  useEffect(() => {
    if (navigation.currentScreen === 'GAME' && !game.isInitialized) {
      setGameStartVisible(true);
      setGameStarted(false);
      
      // Show "GAME START" message for 2 seconds
      const timer = setTimeout(() => {
        setGameStartVisible(false);
        gameLogicResult.initializeGame();
        setGameStarted(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [navigation.currentScreen, game.isInitialized, gameLogicResult, setGameStartVisible, setGameStarted]);

  const renderMainMenu = () => (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-8">
        BROKENCALC
      </div>
      
      <div className="lcd-text text-center">
        <span className="menu-item selected">
          {'>'}{MENU_LABELS[navigation.selectedMenuOption as MenuOption]}
        </span>
      </div>
      
      <div className="lcd-text lcd-text-small text-center mt-8">
        Use calculator buttons to navigate:
      </div>
      <div className="lcd-text lcd-text-small text-center">
        + (up) - (down) = (select) ⌫ (back)
      </div>
      <div className="lcd-text lcd-text-small text-center mt-4">
        Or press 1, 3, 6 for direct access
      </div>
    </div>
  );

  // Handle button press during game
  const handleGameButtonPress = (buttonId: string) => {
    // Check if we're in win display mode first
    if (gameLogicResult.gameState?.gameStatus === 'won' && gameLogicResult.gameState?.showWinDisplay) {
      // Route to win display navigation
      const handled = gameLogicResult.handleWinDisplayInput(buttonId);
      if (handled) return;
    }
    
    // Normal game button handling
    if (!gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing') return;
    calculatorResult.handleButtonPress(buttonId);
  };

  // Handle button press for navigation
  const handleNavigationButtonPress = (buttonId: string) => {
    console.log('Navigation button press:', buttonId);
    actions.handleCalculatorButtonInput(buttonId);
  };

  // Game rendering functions
  const renderGameStartMessage = () => (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        GAME START
      </div>
      <div className="lcd-text">
        {(navigation.selectedDifficulty || 'easy').toUpperCase()} MODE
      </div>
      <div className="lcd-text lcd-text-small mt-8">
        Initializing...
      </div>
    </div>
  );

  const renderGameInterface = () => {
    if (!gameLogicResult.gameState || !gameLogicResult.isInitialized) {
      return (
        <div className="text-center">
          <div className="lcd-text">Loading game...</div>
        </div>
      );
    }

    // Create enhanced game state for display
    const enhancedGameState = {
      ...gameLogicResult.gameState,
      userInput: calculatorResult.userInput,
      calculatorDisplay: calculatorResult.display,
      showResult: calculatorResult.showResult,
    };

    // Explicitly set lastResult if it exists
    if (calculatorResult.lastResult !== undefined) {
      enhancedGameState.lastResult = calculatorResult.lastResult;
    }

    return <GameDisplay gameState={enhancedGameState} />;
  };

  const renderCurrentScreen = () => {
    switch (navigation.currentScreen) {
      case 'WELCOME':
        return <WelcomeSequence welcomeState={welcome} />;
      
      case 'MAIN_MENU':
        return renderMainMenu();
      
      case 'DIFFICULTY_SELECTION':
        return (
          <div>
            <DifficultySelection selectedDifficulty={navigation.selectedDifficulty} />
            <div className="lcd-text lcd-text-small text-center mt-6">
              Use + - = ⌫ or press 7, 9 for shortcuts
            </div>
          </div>
        );
      
      case 'GAME':
        return game.showGameStart ? renderGameStartMessage() : renderGameInterface();
      
      case 'HOW_TO_PLAY':
        return (
          <div>
            <HowToPlay 
              scrollPosition={navigation.scrollPosition}
              maxScrollPosition={navigation.maxScrollPosition}
              onSetScrollBounds={actions.setScrollBounds}
            />
            <div className="lcd-text lcd-text-small text-center mt-4">
              Use + - to scroll, ⌫ to go back
            </div>
          </div>
        );
      
      case 'LEADERBOARD':
        return (
          <div>
            <Leaderboard 
              scrollPosition={navigation.scrollPosition}
              maxScrollPosition={navigation.maxScrollPosition}
              onSetScrollBounds={actions.setScrollBounds}
            />
            <div className="lcd-text lcd-text-small text-center mt-4">
              Use + - to scroll, ⌫ to go back
            </div>
          </div>
        );
      
      default:
        return renderMainMenu();
    }
  };

  // Conditional calculator button routing
  const renderCalculatorButtons = () => {
    const isGameActive = navigation.currentScreen === 'GAME' && 
                        !game.showGameStart && 
                        game.gameStarted && 
                        gameLogicResult.gameState && 
                        gameLogicResult.gameState.gameStatus === 'playing';

    const isWinDisplay = navigation.currentScreen === 'GAME' && 
                        gameLogicResult.gameState?.gameStatus === 'won' && 
                        gameLogicResult.gameState?.showWinDisplay;

    const isNavigationMode = navigation.currentScreen !== 'WELCOME' && navigation.currentScreen !== 'GAME';

    // Determine which handler to use
    let buttonHandler: (buttonId: string) => void;
    let disabled = false;

    if (isGameActive || isWinDisplay) {
      // Game mode or win display: route to game logic
      buttonHandler = handleGameButtonPress;
      disabled = false;
    } else if (isNavigationMode) {
      // Navigation mode: route to navigation logic
      buttonHandler = handleNavigationButtonPress;
      disabled = navigation.isTransitioning;
    } else {
      // Disabled mode (welcome screen, game start message, etc.)
      buttonHandler = () => {}; // No-op
      disabled = true;
    }

    return (
      <Calculator 
        onButtonPress={buttonHandler}
        disabled={disabled}
      />
    );
  };

  return (
    <CalculatorDisplay 
      isTransitioning={navigation.isTransitioning}
      calculatorButtons={renderCalculatorButtons()}
    >
      {renderCurrentScreen()}
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