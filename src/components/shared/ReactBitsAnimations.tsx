/**
 * Animation wrapper components
 * Provides simple animation components (ReactBits removed)
 */

import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Bounce animation wrapper for text elements
 * Simple wrapper with animation delay
 */
export const AnimatedBounce: React.FC<AnimatedTextProps> = ({ children, delay = 0 }) => {
  return (
    <div 
      style={{ 
        animationDelay: `${delay}s`,
        display: 'inline-block',
      }}
    >
      {children}
    </div>
  );
};

interface ClickSparkButtonProps {
  children: ReactNode;
  sparkColor?: string;
  sparkCount?: number;
}

/**
 * Button wrapper component
 * Simple wrapper that passes through children
 */
export const SparkButton: React.FC<ClickSparkButtonProps> = ({
  children,
  sparkColor: _sparkColor = '#00f2ff',
  sparkCount: _sparkCount = 12,
}) => {
  return <>{children}</>;
};

interface StarBorderCardProps {
  children: ReactNode;
  color?: string;
  speed?: string;
}

/**
 * Card wrapper component
 * Simple wrapper that passes through children
 */
export const StarBorderCard: React.FC<StarBorderCardProps> = ({
  children,
  color: _color = '#00f2ff',
  speed: _speed = '3s',
}) => {
  return <>{children}</>;
};
