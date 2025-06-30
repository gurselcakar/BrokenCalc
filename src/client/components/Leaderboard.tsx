import React, { useRef } from 'react';
import { ScrollableContent } from './ScrollableContent';
import { useScrollBounds } from '../utils/scrollLogic';

interface LeaderboardProps {
  scrollPosition?: number;
  maxScrollPosition?: number;
  onSetScrollBounds?: (maxScroll: number) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  scrollPosition = 0,
  maxScrollPosition = 0,
  onSetScrollBounds,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Use centralized scroll bounds calculation
  useScrollBounds(contentRef, onSetScrollBounds);

      return (
      <ScrollableContent 
        scrollPosition={scrollPosition}
        maxScrollPosition={maxScrollPosition}
        {...(onSetScrollBounds && { onScrollBoundsChange: onSetScrollBounds })}
      >
      <div ref={contentRef}>
        <div className="lcd-text lcd-text-large text-center mb-6">
          LEADERBOARD
        </div>
        
        <div className="lcd-text text-center mb-4">
          TOP SCORES
        </div>
        
        <div className="lcd-text lcd-text-small mb-2">
          1. PLAYER_ONE      120s EASY
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          2. CALC_MASTER     95s  MEDIUM
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          3. MATH_WIZARD     78s  HARD
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          4. BROKEN_HERO     45s  HARDCORE
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          5. GOD_TIER_PRO    12s  GOD TIER
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          6. SPEED_DEMON     89s  MEDIUM
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          7. CALC_NINJA      67s  HARD
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          8. BUTTON_MASTER   156s EASY
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          9. MATH_GENIUS     34s  HARDCORE
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          10. LEGEND_USER    23s  HARDCORE
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          11. QUICK_SOLVER   98s  MEDIUM
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          12. CALC_BEAST     142s EASY
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          13. NUMBER_WIZARD  56s  HARD
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          14. BUTTON_HERO    28s  HARDCORE
        </div>
        <div className="lcd-text lcd-text-small mb-2">
          15. FAST_FINGERS   87s  MEDIUM
        </div>
        
        <div className="lcd-text lcd-text-small text-center mt-8">
          Scores will be implemented
        </div>
        <div className="lcd-text lcd-text-small text-center">
          in Phase 8
        </div>

      </div>
    </ScrollableContent>
  );
};