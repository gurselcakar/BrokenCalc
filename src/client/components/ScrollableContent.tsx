import React, { useEffect, useRef } from 'react';

interface ScrollableContentProps {
  children: React.ReactNode;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
  onScrollBoundsChange?: (maxScroll: number) => void;
  scrollPosition?: number;
  maxScrollPosition?: number;
  className?: string;
}

export const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  onScrollBoundsChange,
  scrollPosition = 0,
  maxScrollPosition = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content overflows container
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;
        const isOverflowing = contentHeight > containerHeight;
        
        console.log('ScrollableContent overflow check:', {
          containerHeight,
          contentHeight,
          isOverflowing,
          maxScrollPosition
        });
        

        
        // Calculate max scroll position and notify parent
        if (isOverflowing) {
          const lineHeight = 28;
          const totalLines = Math.ceil(contentHeight / lineHeight);
          const visibleLines = Math.floor(containerHeight / lineHeight);
          const maxScroll = Math.max(0, totalLines - visibleLines);
          
          console.log('Calculated scroll bounds:', {
            totalLines,
            visibleLines,
            maxScroll
          });
          
          onScrollBoundsChange?.(maxScroll);
        } else {
          onScrollBoundsChange?.(0);
        }
      }
    };

    // Multiple checks to ensure elements are rendered
    const timer1 = setTimeout(checkOverflow, 100);
    const timer2 = setTimeout(checkOverflow, 300);
    const timer3 = setTimeout(checkOverflow, 500);
    window.addEventListener('resize', checkOverflow);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [children, onScrollBoundsChange, maxScrollPosition]);

  // Handle scroll positioning
  useEffect(() => {
    if (containerRef.current) {
      const lineHeight = 28; // More accurate line height for LCD text
      const scrollTop = scrollPosition * lineHeight;
      
      console.log('Applying scroll:', {
        scrollPosition,
        lineHeight,
        scrollTop,
        maxScrollPosition,
        containerHeight: containerRef.current.clientHeight,
        containerScrollHeight: containerRef.current.scrollHeight
      });
      
      // Apply scroll to container (which has overflow)
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollPosition, maxScrollPosition]);

  return (
    <div className={`scrollable-container ${className}`} ref={containerRef}>
      <div 
        ref={contentRef}
        className="scrollable-content"
      >
        {children}
      </div>
      

    </div>
  );
}; 