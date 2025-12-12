# Theming (Dark Mode + Custom Themes)

## Theme Provider Usage

**Chakra UI Theme** (`@/shared/design-system`):
```typescript
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Custom theme tokens
});
```

**Always use** `@/shared/design-system`, never import directly from Chakra UI.

## Light/Dark Mode Toggle

**Implementation**:
```typescript
import { useColorMode, IconButton } from '@chakra-ui/react';

const { colorMode, toggleColorMode } = useColorMode();
<IconButton onClick={toggleColorMode} aria-label="Toggle theme" />
```

**Store user preference** in localStorage or user profile.

## Persisting Theme in Local Storage

**Custom Hook**:
```typescript
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return [theme, setTheme];
};
```

**Chakra UI** handles this automatically with `useColorMode`.

## CSS Variables Strategy

**Define tokens**:
```css
:root {
  --color-primary: #3182ce;
  --color-bg: #ffffff;
}

[data-theme="dark"] {
  --color-bg: #1a202c;
}
```

**Use in components**: Prefer theme tokens over hardcoded colors.

## Accessibility Checks for Contrast

**WCAG AA Requirements**:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Tools**: Use browser DevTools or axe DevTools to check contrast.

**Test both themes**: Ensure readability in light and dark modes.

