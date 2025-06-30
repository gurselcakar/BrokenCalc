import { TRANSITION_DELAY } from '../constants/navigation';

/**
 * Creates a standardized transition handler that sets transition state and resets it after delay
 * @param setTransition Function to set transition state
 * @returns Timer ID for cleanup if needed
 */
export const createTransitionHandler = (setTransition: (val: boolean) => void): ReturnType<typeof setTimeout> => {
  setTransition(true);
  return setTimeout(() => setTransition(false), TRANSITION_DELAY);
};

/**
 * Creates a delayed action with transition state management
 * @param action Function to execute after delay
 * @param setTransition Function to set transition state
 * @param delay Optional custom delay (defaults to TRANSITION_DELAY)
 * @returns Timer ID for cleanup if needed
 */
export const createDelayedAction = (
  action: () => void,
  setTransition: (val: boolean) => void,
  delay: number = TRANSITION_DELAY
): ReturnType<typeof setTimeout> => {
  setTransition(true);
  return setTimeout(() => {
    action();
    setTransition(false);
  }, delay);
};

/**
 * Helper for quick transition without custom logic
 * @param setTransition Function to set transition state
 */
export const triggerTransition = (setTransition: (val: boolean) => void): void => {
  createTransitionHandler(setTransition);
}; 