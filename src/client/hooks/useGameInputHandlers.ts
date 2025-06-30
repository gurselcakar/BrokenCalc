import { useCallback, useRef } from 'react';

export interface GameInputHandlers {
  handleGameButtonPress: (buttonId: string) => boolean;
  isGameActive: boolean;
  isWinDisplay: boolean;
}

// Module-level store for game input handlers
let gameInputHandlersStore: GameInputHandlers | null = null;

export const useGameInputHandlers = () => {
  const handlersRef = useRef<GameInputHandlers | null>(null);

  // Register game input handlers
  const registerHandlers = useCallback((handlers: GameInputHandlers) => {
    handlersRef.current = handlers;
    gameInputHandlersStore = handlers;
  }, []);

  // Unregister game input handlers
  const unregisterHandlers = useCallback(() => {
    handlersRef.current = null;
    gameInputHandlersStore = null;
  }, []);

  // Get current handlers
  const getHandlers = useCallback((): GameInputHandlers | null => {
    return gameInputHandlersStore;
  }, []);

  return {
    registerHandlers,
    unregisterHandlers,
    getHandlers,
  };
}; 