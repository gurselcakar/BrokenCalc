import React from 'react';

export const HowToPlay: React.FC = () => {
  return (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-6">
        HOW TO PLAY
      </div>
      
      <div className="lcd-text lcd-text-small mb-4">
        • Calculator buttons are scrambled
      </div>
      <div className="lcd-text lcd-text-small mb-4">
        • Solve math problems in 2 minutes
      </div>
      <div className="lcd-text lcd-text-small mb-4">
        • Discover which button does what
      </div>
      <div className="lcd-text lcd-text-small mb-4">
        • Press = with correct answer to win
      </div>
      
      <div className="lcd-text text-center mt-8 mb-2">
        NAVIGATION:
      </div>
      <div className="lcd-text lcd-text-small text-center">
        ▲▼ Navigate • OK Select • ◄ Back
      </div>
      <div className="lcd-text lcd-text-small text-center">
        Arrow keys • Enter • Escape
      </div>
      
      <div className="lcd-text lcd-text-small text-center mt-8">
        Press ◄ to return
      </div>
    </div>
  );
};