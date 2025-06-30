import React from 'react';
import { HowToPlay } from '../components/HowToPlay';
import { useAppNavigation } from '../hooks/useAppState';

export const HowToPlayScreen: React.FC = () => {
  const { navigation, setScrollBounds } = useAppNavigation();
  
  return (
    <div>
      <HowToPlay 
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