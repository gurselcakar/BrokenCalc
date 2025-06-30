import React from 'react';
import { DifficultySelection } from '../components/DifficultySelection';
import { useAppNavigation } from '../hooks/useAppState';

export const DifficultySelectionScreen: React.FC = () => {
  const { navigation } = useAppNavigation();
  
  return (
    <div>
      <DifficultySelection selectedDifficulty={navigation.selectedDifficulty} />
      <div className="lcd-text lcd-text-small text-center mt-6">
        Use + - = ⌫ or press 7, 9 for shortcuts
      </div>
    </div>
  );
}; 