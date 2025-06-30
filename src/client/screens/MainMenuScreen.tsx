import React from 'react';
import { useAppNavigation } from '../hooks/useAppState';
import type { MenuOption } from '../../shared/types/navigation';

const MENU_LABELS: Record<MenuOption, string> = {
  PLAY: 'PLAY',
  'HOW TO PLAY': 'HOW TO PLAY',
  LEADERBOARD: 'LEADERBOARD',
};

export const MainMenuScreen: React.FC = () => {
  const { navigation } = useAppNavigation();
  
  return (
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
}; 