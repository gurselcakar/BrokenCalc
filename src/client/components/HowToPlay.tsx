import React, { useEffect, useRef } from 'react';
import { ScrollableContent } from './ScrollableContent';

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
          
          console.log('HowToPlay scroll calculation:', {
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