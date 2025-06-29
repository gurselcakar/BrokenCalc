import React from 'react';

export const Leaderboard: React.FC = () => {
  return (
    <div>
      <div className="lcd-text lcd-text-large text-center mb-6">
        LEADERBOARD
      </div>
      
      <div className="lcd-text text-center mb-4">
        TOP SCORES
      </div>
      
      <div className="lcd-text lcd-text-small mb-2">
        1. PLAYER_ONE    120s EASY
      </div>
      <div className="lcd-text lcd-text-small mb-2">
        2. CALC_MASTER   95s  MEDIUM
      </div>
      <div className="lcd-text lcd-text-small mb-2">
        3. MATH_WIZARD   78s  HARD
      </div>
      <div className="lcd-text lcd-text-small mb-2">
        4. BROKEN_HERO   45s  HARDCORE
      </div>
      <div className="lcd-text lcd-text-small mb-2">
        5. GOD_TIER_PRO  12s  GOD TIER
      </div>
      
      <div className="lcd-text lcd-text-small text-center mt-8">
        Scores will be implemented
      </div>
      <div className="lcd-text lcd-text-small text-center">
        in Phase 8
      </div>
      
      <div className="lcd-text lcd-text-small text-center mt-6">
        Press ◄ to return
      </div>
    </div>
  );
};