/**
 * Logo component - Reusable logo that matches the favicon
 */

import { Box, Image, HStack, Heading, useColorModeValue, useBreakpointValue } from '@/shared/design-system';
import { APP_CONSTANTS } from '@/constants/app';

type LogoSize = 'sm' | 'md' | 'lg';
type ResponsiveSize = LogoSize | { base?: LogoSize; sm?: LogoSize; md?: LogoSize; lg?: LogoSize };

interface LogoProps {
  /**
   * Show text alongside the logo
   */
  showText?: boolean;
  /**
   * Size of the logo (can be a string or responsive object)
   */
  size?: ResponsiveSize;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Logo component that displays the favicon logo
 * @param showText - Whether to show brand name alongside logo
 * @param size - Size of the logo (sm, md, lg) or responsive object
 * @param onClick - Click handler for navigation
 */
export const Logo: React.FC<LogoProps> = ({ 
  showText = true, 
  size = 'md',
  onClick,
  className 
}) => {
  const headingColor = useColorModeValue('blue.600', 'blue.400');
  
  const sizeMap = {
    sm: { logo: 24, heading: 'sm' },
    md: { logo: 32, heading: 'md' },
    lg: { logo: 48, heading: 'lg' },
  };

  // Handle responsive size objects or simple string sizes
  let resolvedSize: LogoSize = 'md';
  if (size) {
    if (typeof size === 'object') {
      const breakpointSize = useBreakpointValue(size, { fallback: 'md' });
      resolvedSize = (breakpointSize && sizeMap[breakpointSize as LogoSize]) ? (breakpointSize as LogoSize) : 'md';
    } else if (sizeMap[size as LogoSize]) {
      resolvedSize = size as LogoSize;
    }
  }

  const dimensions = sizeMap[resolvedSize];

  return (
    <HStack
      spacing={2}
      alignItems="center"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      className={className}
      _hover={onClick ? { opacity: 0.8 } : {}}
      transition="opacity 0.2s"
    >
      <Box
        width={`${dimensions.logo}px`}
        height={`${dimensions.logo}px`}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src="/favicon.svg"
          alt={`${APP_CONSTANTS.BRAND_NAME} Logo`}
          width={`${dimensions.logo}px`}
          height={`${dimensions.logo}px`}
          objectFit="contain"
        />
      </Box>
      {showText && (
        <Heading
          size={dimensions.heading as 'sm' | 'md' | 'lg'}
          color={headingColor}
          fontWeight="bold"
        >
          {APP_CONSTANTS.BRAND_NAME}
        </Heading>
      )}
    </HStack>
  );
};

