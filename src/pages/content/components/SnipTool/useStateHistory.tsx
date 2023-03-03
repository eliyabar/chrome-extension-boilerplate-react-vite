import { useState } from 'react';

interface UseStateHistory<T> {
  newChange(state: T): void;

  undo(): T | undefined;

  redo(): T | undefined;

  canUndo: boolean;
  canRedo: boolean;
  state: T | undefined;
}

export const useStateHistory = function <T>(options: {
  isEqual?: (a: T, b: T) => boolean;
}): UseStateHistory<T> {
  const [history, setHistory] = useState<{ states: Array<T>; index: number }>({
    states: [],
    index: -1,
  });

  const newChange = (state: T) => {
    if (
      options.isEqual &&
      history.index &&
      history.states[history.index] &&
      options.isEqual(state, history.states[history.index]!)
    )
      return;
    setHistory((history) => ({
      states: [...history.states.slice(0, history.index + 1), state],
      index: history.index + 1,
    }));
  };
  const undo = () => {
    if (history.states.length > 0) {
      const prevIndex = history.index - 1;
      const previousState = history.states[prevIndex];
      setHistory((history) => ({
        states: history.states,
        index: history.index - 1,
      }));
      return previousState;
    }
  };
  const redo = () => {
    if (history.states.length - 1 > history.index) {
      const nextState = history.states[history.index + 1];
      setHistory((history) => ({
        states: history.states,
        index: history.index + 1,
      }));
      return nextState;
    }
  };
  return {
    newChange,
    undo,
    redo,
    canUndo: history.index > 0,
    canRedo: history.states.length - 1 > history.index,
    state: history.states[history.index],
  };
};
