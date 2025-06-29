import React, { useEffect, useRef } from 'react';
import { ScrollableContent } from './ScrollableContent';

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

  // Calculate scroll bounds based on content height
  useEffect(() => {
    const calculateScrollBounds = () => {
      if (contentRef.current && onSetScrollBounds) {
        // Get the actual container height from the parent's parent (scrollable-content -> scrollable-container)
        const scrollableContent = contentRef.current.parentElement;
        const scrollableContainer = scrollableContent?.parentElement;
        
        if (scrollableContainer && scrollableContent) {
          const containerHeight = scrollableContainer.clientHeight;
          const contentHeight = contentRef.current.scrollHeight;
          const lineHeight = 28; // More accurate line height for LCD text
          
          // Calculate how many lines we need to scroll to see all content
          const totalLines = Math.ceil(contentHeight / lineHeight);
          const visibleLines = Math.floor(containerHeight / lineHeight);
          const maxScroll = Math.max(0, totalLines - visibleLines);
          
          console.log('Leaderboard scroll calculation:', {
            containerHeight,
            contentHeight,
            lineHeight,
            totalLines,
            visibleLines,
            maxScroll,
            overflow: contentHeight > containerHeight
          });
          
          onSetScrollBounds(maxScroll);
        }
      }
    };

    // Calculate after component mounts and on resize
    const timer1 = setTimeout(calculateScrollBounds, 100);
    const timer2 = setTimeout(calculateScrollBounds, 500); // Double check after longer delay
    window.addEventListener('resize', calculateScrollBounds);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', calculateScrollBounds);
    };
  }, [onSetScrollBounds]);

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