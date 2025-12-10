/**
 * Font size context for managing global font size preferences
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FontSizeContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_STEP = 2;

interface FontSizeProviderProps {
  children: ReactNode;
}

/**
 * Font size provider component
 */
export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
  }, [fontSize]);

  const setFontSize = (size: number) => {
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
    setFontSizeState(clampedSize);
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + FONT_SIZE_STEP);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - FONT_SIZE_STEP);
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
};

/**
 * Hook to use font size context
 */
export const useFontSize = (): FontSizeContextType => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};

