import React, { useEffect, useState, useRef } from 'react';
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
import type { MenuOption, WelcomeState, DifficultyMode, WinOption } from '../../shared/types/navigation';

interface HomeScreenProps {
  username?: string | undefined;
}

const MENU_LABELS: Record<MenuOption, string> = {
  PLAY: 'PLAY',
  'HOW TO PLAY': 'HOW TO PLAY',
  LEADERBOARD: 'LEADERBOARD',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ username }) => {
  const { state, actions } = useMenuNavigation();
  const [welcomeState, setWelcomeState] = useState<WelcomeState>({
    username: username || null,
    isVisible: true,
    transitionDelay: 2500,
  });
  
  // Track if welcome sequence has been initialized to prevent infinite loops
  const welcomeInitialized = useRef(false);

  // Game state management
  const [showGameStart, setShowGameStart] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game logic hook - only initialize when game screen is active
  const gameLogicResult = useGameLogic({
    difficulty: state.selectedDifficulty ?? 'easy',
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
          setShowGameStart(true);
          setGameStarted(false);
          gameLogicResult.resetGame();
          
          // Show "GAME START" message and restart
          setTimeout(() => {
            setShowGameStart(false);
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
      
      // Hide welcome after delay
      const timer = setTimeout(() => {
        setWelcomeState(prev => ({ ...prev, isVisible: false }));
      }, welcomeState.transitionDelay);

      return () => clearTimeout(timer);
    }
  }, [actions, welcomeState.transitionDelay]);

  // Update welcome state when username changes
  useEffect(() => {
    setWelcomeState(prev => ({ ...prev, username: username || null }));
  }, [username]);

  // Initialize game when GAME screen is shown
  useEffect(() => {
    if (state.currentScreen === 'GAME' && !gameLogicResult.isInitialized) {
      setShowGameStart(true);
      setGameStarted(false);
      
      // Show "GAME START" message for 2 seconds
      const timer = setTimeout(() => {
        setShowGameStart(false);
        gameLogicResult.initializeGame();
        setGameStarted(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state.currentScreen, gameLogicResult.isInitialized, gameLogicResult]);

  const renderMainMenu = () => (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-8">
        BROKENCALC
      </div>
      
      <div className="lcd-text text-center">
        <span className="menu-item selected">
          {'>'}{MENU_LABELS[state.selectedMenuOption as MenuOption]}
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
        {(state.selectedDifficulty || 'easy').toUpperCase()} MODE
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
    switch (state.currentScreen) {
      case 'WELCOME':
        return <WelcomeSequence welcomeState={welcomeState} />;
      
      case 'MAIN_MENU':
        return renderMainMenu();
      
      case 'DIFFICULTY_SELECTION':
        return (
          <div>
            <DifficultySelection selectedDifficulty={state.selectedDifficulty} />
            <div className="lcd-text lcd-text-small text-center mt-6">
              Use + - = ⌫ or press 7, 9 for shortcuts
            </div>
          </div>
        );
      
      case 'GAME':
        return showGameStart ? renderGameStartMessage() : renderGameInterface();
      
      case 'HOW_TO_PLAY':
        return (
          <div>
            <HowToPlay 
              scrollPosition={state.scrollPosition}
              maxScrollPosition={state.maxScrollPosition}
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
              scrollPosition={state.scrollPosition}
              maxScrollPosition={state.maxScrollPosition}
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
    const isGameActive = state.currentScreen === 'GAME' && 
                        !showGameStart && 
                        gameStarted && 
                        gameLogicResult.gameState && 
                        gameLogicResult.gameState.gameStatus === 'playing';

    const isWinDisplay = state.currentScreen === 'GAME' && 
                        gameLogicResult.gameState?.gameStatus === 'won' && 
                        gameLogicResult.gameState?.showWinDisplay;

    const isNavigationMode = state.currentScreen !== 'WELCOME' && state.currentScreen !== 'GAME';

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
      disabled = state.isTransitioning;
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
      isTransitioning={state.isTransitioning}
      calculatorButtons={renderCalculatorButtons()}
    >
      {renderCurrentScreen()}
    </CalculatorDisplay>
  );
};