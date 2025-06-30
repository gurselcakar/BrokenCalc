import React from 'react';
import { Leaderboard } from '../components/Leaderboard';
import { useAppNavigation } from '../hooks/useAppState';

export const LeaderboardScreen: React.FC = () => {
  const { navigation, setScrollBounds } = useAppNavigation();
  
  return (
    <div>
      <Leaderboard 
        scrollPosition={navigation.scrollPosition}
        maxScrollPosition={navigation.maxScrollPosition}
        onSetScrollBounds={setScrollBounds}
      />
      <div className="lcd-text lcd-text-small text-center mt-4">
        Use + - to scroll, ⌫ to go back
      </div>
    </div>
  );
}; 