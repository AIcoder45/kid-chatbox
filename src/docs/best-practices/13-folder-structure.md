# Folder Structure

## Recommended Folder Tree

```
src/
  components/          # React components
    admin/            # Admin-specific components
    auth/             # Auth components
    layout/           # Layout components
    ui/               # Reusable UI components
  constants/          # App constants (NO hardcoded strings)
    index.ts          # Export all constants
  contexts/           # React contexts
  hooks/              # Custom hooks (useCamelCase.ts)
  locales/            # i18n translations
    en/
    hi/
  services/           # API services
  shared/
    design-system/    # Design system components
  types/              # TypeScript types/interfaces
  utils/              # Utility functions
  App.tsx             # Root component
  main.tsx            # Entry point
```

## Where Hooks Live

**Custom Hooks**: `src/hooks/useCamelCase.ts`

**Naming**: Always prefix with `use` (e.g., `useAuth`, `useQuiz`)

**Co-location**: If hook is only used by one component, keep it nearby.

## Where Components Live

**Feature Components**: `src/components/{feature}/`

**Shared Components**: `src/components/ui/` or `@/shared/design-system`

**Layout Components**: `src/components/layout/`

**Admin Components**: `src/components/admin/`

## Where Types Live

**Global Types**: `src/types/index.ts`

**Feature Types**: `src/types/{feature}.ts` (e.g., `quiz.ts`, `auth.ts`)

**Component Types**: Co-located with component if only used there.

## Where Translations Live

**Structure**: `src/locales/{locale}/{namespace}.json`

**Namespaces**: Group by feature (`auth.json`, `quiz.json`, `common.json`)

**Export**: `src/locales/index.ts` exports all translations.

