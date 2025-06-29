import React, { useEffect, useState, useRef } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { MenuNavigation } from './MenuNavigation';
import { WelcomeSequence } from './WelcomeSequence';
import { DifficultySelection } from './DifficultySelection';
import { HowToPlay } from './HowToPlay';
import { Leaderboard } from './Leaderboard';
import { GameDisplay } from './GameDisplay';
import { Calculator } from './Calculator';
import { useMenuNavigation } from '../hooks/useMenuNavigation';
import { useGameLogic } from '../hooks/useGameLogic';
import { useCalculator } from '../hooks/useCalculator';
import type { MenuOption, WelcomeState } from '../../shared/types/navigation';

interface HomeScreenProps {
  username?: string | undefined;
}

const MENU_LABELS: Record<MenuOption, string> = {
  PLAY: 'PLAY',
  'HOW TO PLAY': 'HOW TO PLAY',
  LEADERBOARD: 'LEADERBOARD',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ username }) => {
  const { state, inputMethod, actions } = useMenuNavigation();
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
    difficulty: state.selectedDifficulty || 'easy',
    onGameEnd: (finalScore, won) => {
      console.log('Game ended:', { finalScore, won });
      // TODO: Show victory/defeat screen (Phase 2.4)
      // For now, continue showing game interface with feedback
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
          {'>'}{MENU_LABELS[state.selectedMenuOption]}
        </span>
      </div>
      
      <div className="lcd-text lcd-text-small text-center mt-8">
        Use ▲▼ to navigate
      </div>
      <div className="lcd-text lcd-text-small text-center">
        Press OK to select
      </div>
    </div>
  );



  // Handle button press during game
  const handleGameButtonPress = (buttonId: string) => {
    if (!gameLogicResult.gameState || gameLogicResult.gameState.gameStatus !== 'playing') return;
    calculatorResult.handleButtonPress(buttonId);
  };

  // Game rendering functions
  const renderGameStartMessage = () => (
    <div className="text-center">
      <div className="lcd-text lcd-text-large mb-6">
        GAME START
      </div>
      <div className="lcd-text">
        {(state.selectedDifficulty || 'EASY').toUpperCase()} MODE
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
        return <DifficultySelection selectedDifficulty={state.selectedDifficulty} />;
      
      case 'GAME':
        return showGameStart ? renderGameStartMessage() : renderGameInterface();
      
      case 'HOW_TO_PLAY':
        return (
          <HowToPlay 
            scrollPosition={state.scrollPosition}
            maxScrollPosition={state.maxScrollPosition}
            onSetScrollBounds={actions.setScrollBounds}
          />
        );
      
      case 'LEADERBOARD':
        return (
          <Leaderboard 
            scrollPosition={state.scrollPosition}
            maxScrollPosition={state.maxScrollPosition}
            onSetScrollBounds={actions.setScrollBounds}
          />
        );
      
      default:
        return renderMainMenu();
    }
  };

  // Render calculator buttons when in game mode
  const renderCalculatorButtons = () => {
    if (state.currentScreen === 'GAME' && !showGameStart && gameStarted && gameLogicResult.gameState) {
      return (
        <Calculator 
          onButtonPress={handleGameButtonPress}
          disabled={gameLogicResult.gameState.gameStatus !== 'playing'}
        />
      );
    }
    return null;
  };

  return (
    <CalculatorDisplay 
      isTransitioning={state.isTransitioning}
      calculatorButtons={renderCalculatorButtons()}
    >
      {renderCurrentScreen()}
      
      {/* Navigation Buttons - Hidden during welcome and game screens */}
      {state.currentScreen !== 'WELCOME' && state.currentScreen !== 'GAME' && (
        <MenuNavigation
          state={state}
          inputMethod={inputMethod}
          onNavigateUp={actions.navigateUp}
          onNavigateDown={actions.navigateDown}
          onSelect={actions.select}
          onBack={actions.back}
        />
      )}
    </CalculatorDisplay>
  );
};