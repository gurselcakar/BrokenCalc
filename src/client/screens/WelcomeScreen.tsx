import React from 'react';
import { WelcomeSequence } from '../components/WelcomeSequence';
import { useAppWelcome } from '../hooks/useAppState';

export const WelcomeScreen: React.FC = () => {
  const { welcome } = useAppWelcome();
  
  return <WelcomeSequence welcomeState={welcome} />;
}; 