import { useState, useCallback } from 'react';

/**
 * Custom hook for managing undo/redo history
 * Provides state management with history tracking
 */
export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<T[]>([initialState]);

  const setState = useCallback((action: T | ((prev: T) => T)) => {
    setHistory((currentHistory) => {
      const currentState = currentHistory[index];
      const newState = typeof action === 'function' 
        ? (action as (prev: T) => T)(currentState)
        : action;
      
      // Remove future states and add new state
      const newHistory = currentHistory.slice(0, index + 1);
      newHistory.push(newState);
      
      // Limit history to 50 steps to prevent memory issues
      const limitedHistory = newHistory.length > 50 
        ? newHistory.slice(newHistory.length - 50)
        : newHistory;
      
      // Update index
      setIndex(limitedHistory.length - 1);
      
      return limitedHistory;
    });
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    setHistory((currentHistory) => {
      if (index < currentHistory.length - 1) {
        setIndex(index + 1);
      }
      return currentHistory;
    });
  }, [index]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return {
    state: history[index],
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory: () => {
      setHistory([history[index]]);
      setIndex(0);
    }
  };
}
