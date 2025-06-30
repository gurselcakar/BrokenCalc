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
    <div className="nav-buttons absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-10">
      {/* Up Arrow */}
      <button
        className="nav-button text-base px-3 py-2"
        onClick={onNavigateUp}
        disabled={state.isTransitioning}
        aria-label="Navigate up"
      >
        ▲
      </button>
      
      {/* OK Button */}
      <button
        className="nav-button text-base px-3 py-2"
        onClick={onSelect}
        disabled={state.isTransitioning}
        aria-label="Select"
      >
        OK
      </button>
      
      {/* Down Arrow */}
      <button
        className="nav-button text-base px-3 py-2"
        onClick={onNavigateDown}
        disabled={state.isTransitioning}
        aria-label="Navigate down"
      >
        ▼
      </button>
      
      {/* Back Button */}
      <button
        className={`nav-button text-base px-3 py-2 ${!state.showBackButton ? 'opacity-0 pointer-events-none' : ''}`}
        onClick={onBack}
        disabled={state.isTransitioning || !state.showBackButton}
        aria-label="Go back"
      >
        ◄
      </button>
    </div>
  );
};