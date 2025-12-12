# Multi-Language (i18n)

## Folder Structure for Locales

```
src/
  locales/
    en/
      common.json
      auth.json
      quiz.json
      study.json
    hi/
      common.json
      auth.json
      quiz.json
      study.json
    index.ts  # Export all translations
```

## How to Add Translations

**1. Add keys to JSON files**:
```json
{
  "welcome": "Welcome",
  "login": "Login",
  "logout": "Logout"
}
```

**2. Use in components**:
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('common');
return <Text>{t('welcome')}</Text>;
```

## Avoiding Hardcoded Text

**❌ Bad**:
```typescript
<Button>Submit</Button>
<Text>Welcome back!</Text>
```

**✅ Good**:
```typescript
<Button>{t('submit')}</Button>
<Text>{t('welcomeBack')}</Text>
```

**Rule**: ALL user-facing text must use i18n keys.

## Lazy Loading Translation Bundles

**Load translations on demand**:
```typescript
const loadLocale = async (locale: string) => {
  const translations = await import(`@/locales/${locale}/common.json`);
  return translations.default;
};
```

**Benefits**: Smaller initial bundle, faster load time.

## Handling RTL Languages

**CSS Logical Properties**:
- Use `margin-inline-start` instead of `margin-left`
- Use `text-align: start` instead of `left`

**Chakra UI**: Automatically handles RTL with `direction` prop.

## Date and Currency Formatting

**Use `Intl` API**:
```typescript
new Intl.DateTimeFormat(locale, options).format(date);
new Intl.NumberFormat(locale, { style: 'currency' }).format(amount);
```

**Libraries**: `date-fns`, `moment.js` (if needed).

