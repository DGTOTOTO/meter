import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CounterContextType {
  counter: number;
  addToCounter: (value: number) => void;
  subtractFromCounter: (value: number) => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const [counter, setCounter] = useState<number>(0);

  const addToCounter = (value: number) => {
    setCounter(counter + value);
  };

  const subtractFromCounter = (value: number) => {
    setCounter(counter - value);
  };

  return (
    <CounterContext.Provider value={{ counter, addToCounter, subtractFromCounter }}>
      {children}
    </CounterContext.Provider>
  );
};
