import React, { useRef } from 'react';
import { ScrollableContent } from './ScrollableContent';
import { useScrollBounds } from '../utils/scrollLogic';

interface HowToPlayProps {
  scrollPosition?: number;
  maxScrollPosition?: number;
  onSetScrollBounds?: (maxScroll: number) => void;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({
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
        
        <div className="lcd-text text-center mt-6 mb-4">
          DIFFICULTY MODES:
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          EASY: Only numbers scrambled
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          MEDIUM: Numbers + operators mixed
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          HARD: All buttons scrambled
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          HARDCORE: Maximum confusion mode
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          GOD TIER: Display lies about inputs
        </div>
        
        <div className="lcd-text text-center mt-6 mb-2">
          TIPS:
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          • Try pressing every button first
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          • Look for patterns in scrambling
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          • Remember which buttons work correctly
        </div>
        <div className="lcd-text lcd-text-small mb-3">
          • Work backwards from the answer
        </div>

      </div>
    </ScrollableContent>
  );
};