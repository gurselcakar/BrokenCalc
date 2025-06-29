import React from 'react';
import type { WelcomeState } from '../../shared/types/navigation';

interface WelcomeSequenceProps {
  welcomeState: WelcomeState;
}

export const WelcomeSequence: React.FC<WelcomeSequenceProps> = ({ welcomeState }) => {
  if (!welcomeState.isVisible) return null;

  return (
    <div className="welcome-animation">
      <div className="lcd-text lcd-text-large text-center">
        WELCOME
      </div>
      {welcomeState.username && (
        <div className="lcd-text text-center mt-4">
          {welcomeState.username.toUpperCase()}
        </div>
      )}
      <div className="lcd-text lcd-text-small text-center mt-8">
        INITIALIZING...
      </div>
    </div>
  );
};