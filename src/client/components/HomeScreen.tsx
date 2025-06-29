import React, { useEffect, useState } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { MenuNavigation } from './MenuNavigation';
import { WelcomeSequence } from './WelcomeSequence';
import { DifficultySelection } from './DifficultySelection';
import { ComingSoon } from './ComingSoon';
import { HowToPlay } from './HowToPlay';
import { Leaderboard } from './Leaderboard';
import { useMenuNavigation } from '../hooks/useMenuNavigation';
import type { MenuOption, WelcomeState } from '../../shared/types/navigation';

interface HomeScreenProps {
  username?: string;
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

  // Initialize welcome sequence on mount
  useEffect(() => {
    actions.startWelcomeSequence(username);
    
    // Hide welcome after delay
    const timer = setTimeout(() => {
      setWelcomeState(prev => ({ ...prev, isVisible: false }));
    }, welcomeState.transitionDelay);

    return () => clearTimeout(timer);
  }, [username, actions, welcomeState.transitionDelay]);

  const renderMainMenu = () => (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-8">
        BROKENCALC
      </div>
      
      <div className="lcd-text text-center">
        <span className="menu-item selected">
          &gt;{MENU_LABELS[state.selectedMenuOption]}
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

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'WELCOME':
        return <WelcomeSequence welcomeState={welcomeState} />;
      
      case 'MAIN_MENU':
        return renderMainMenu();
      
      case 'DIFFICULTY_SELECTION':
        return <DifficultySelection selectedDifficulty={state.selectedDifficulty} />;
      
      case 'COMING_SOON':
        return <ComingSoon selectedDifficulty={state.selectedDifficulty} />;
      
      case 'HOW_TO_PLAY':
        return <HowToPlay />;
      
      case 'LEADERBOARD':
        return <Leaderboard />;
      
      default:
        return renderMainMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <CalculatorDisplay isTransitioning={state.isTransitioning}>
        {renderCurrentScreen()}
        
        {/* Navigation Buttons - Hidden during welcome */}
        {state.currentScreen !== 'WELCOME' && (
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
    </div>
  );
};