import React from 'react';
import type { HomeScreenState, InputMethod } from '../../shared/types/navigation';

interface MenuNavigationProps {
  state: HomeScreenState;
  inputMethod: InputMethod;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onSelect: () => void;
  onBack: () => void;
}

export const MenuNavigation: React.FC<MenuNavigationProps> = ({
  state,
  onNavigateUp,
  onNavigateDown,
  onSelect,
  onBack,
}) => {
  return (
    <div className="nav-buttons">
      {/* Up Arrow */}
      <button
        className="nav-button"
        onClick={onNavigateUp}
        disabled={state.isTransitioning}
        aria-label="Navigate up"
      >
        ▲
      </button>
      
      {/* OK Button */}
      <button
        className="nav-button"
        onClick={onSelect}
        disabled={state.isTransitioning}
        aria-label="Select"
      >
        OK
      </button>
      
      {/* Down Arrow */}
      <button
        className="nav-button"
        onClick={onNavigateDown}
        disabled={state.isTransitioning}
        aria-label="Navigate down"
      >
        ▼
      </button>
      
      {/* Back Button */}
      <button
        className={`nav-button ${!state.showBackButton ? 'hidden' : ''}`}
        onClick={onBack}
        disabled={state.isTransitioning || !state.showBackButton}
        aria-label="Go back"
      >
        ◄
      </button>
    </div>
  );
};