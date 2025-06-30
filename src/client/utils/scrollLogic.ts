import { useEffect, RefObject } from 'react';

// Constants for scroll calculations
const LINE_HEIGHT = 28; // LCD text line height
const SCROLL_CHECK_DELAYS = [100, 300, 500] as const; // Multiple checks to ensure elements are rendered

/**
 * Calculate scroll bounds based on container and content dimensions
 * @param containerHeight Height of the scrollable container
 * @param contentHeight Height of the content
 * @returns Maximum scroll position (in lines)
 */
export const calculateScrollBounds = (containerHeight: number, contentHeight: number): number => {
  const totalLines = Math.ceil(contentHeight / LINE_HEIGHT);
  const visibleLines = Math.floor(containerHeight / LINE_HEIGHT);
  return Math.max(0, totalLines - visibleLines);
};

/**
 * Hook to automatically calculate and set scroll bounds for scrollable content
 * @param contentRef Ref to the content element
 * @param onSetScrollBounds Callback to set scroll bounds
 */
export const useScrollBounds = (
  contentRef: RefObject<HTMLDivElement | null>,
  onSetScrollBounds?: (maxScroll: number) => void
) => {
  useEffect(() => {
    const calculateBounds = () => {
      if (contentRef.current && onSetScrollBounds) {
        // Navigate up the DOM tree: content -> scrollable-content -> scrollable-container
        const scrollableContent = contentRef.current.parentElement;
        const scrollableContainer = scrollableContent?.parentElement;
        
        if (scrollableContainer && scrollableContent) {
          const containerHeight = scrollableContainer.clientHeight;
          const contentHeight = contentRef.current.scrollHeight;
          const maxScroll = calculateScrollBounds(containerHeight, contentHeight);
          
          onSetScrollBounds(maxScroll);
        }
      }
    };

    // Multiple checks with different delays to ensure elements are fully rendered
    const timers = SCROLL_CHECK_DELAYS.map(delay => 
      setTimeout(calculateBounds, delay)
    );
    
    // Add resize listener for responsive scroll bounds
    window.addEventListener('resize', calculateBounds);
    
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', calculateBounds);
    };
  }, [contentRef, onSetScrollBounds]);
}; 