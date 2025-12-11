/**
 * Quiz Timer Context - Provides timer state to Header and other components
 */

import { createContext, useContext, useState, ReactNode } from 'react';

interface QuizTimerContextType {
  timeRemaining: number;
  totalTime: number;
  isQuizActive: boolean;
  setTimer: (timeRemaining: number, totalTime: number, isActive: boolean) => void;
}

const QuizTimerContext = createContext<QuizTimerContextType | undefined>(undefined);

interface QuizTimerProviderProps {
  children: ReactNode;
}

/**
 * Provider for quiz timer context
 */
export const QuizTimerProvider: React.FC<QuizTimerProviderProps> = ({ children }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  const setTimer = (remaining: number, total: number, isActive: boolean) => {
    setTimeRemaining(remaining);
    setTotalTime(total);
    setIsQuizActive(isActive);
  };

  return (
    <QuizTimerContext.Provider value={{ timeRemaining, totalTime, isQuizActive, setTimer }}>
      {children}
    </QuizTimerContext.Provider>
  );
};

/**
 * Hook to use quiz timer context
 */
export const useQuizTimer = (): QuizTimerContextType => {
  const context = useContext(QuizTimerContext);
  if (context === undefined) {
    throw new Error('useQuizTimer must be used within a QuizTimerProvider');
  }
  return context;
};

