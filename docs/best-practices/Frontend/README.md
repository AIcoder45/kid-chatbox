# Frontend Best Practices Documentation

This directory contains comprehensive best practices documentation for React frontend development.

## Topics Covered

1. [Component & UI Structure](./01-component-ui-structure.md)
2. [State Management](./02-state-management.md)
3. [API Interactions](./03-api-interactions.md)
4. [Multi-Language (i18n)](./04-multi-language-i18n.md)
5. [Theming (Dark Mode)](./05-theming-dark-mode.md)
6. [Responsive Design](./06-responsive-design.md)
7. [Forms](./07-forms.md)
8. [Performance](./08-performance.md)
9. [Accessibility (A11y)](./09-accessibility-a11y.md)
10. [UI Consistency](./10-ui-consistency.md)
11. [Error Handling](./11-error-handling-ui.md)
12. [Loading States](./12-loading-states.md)
13. [Folder Structure](./13-folder-structure.md)
14. [Custom Hooks](./14-custom-hooks.md)
15. [Auth UI Flow](./15-auth-ui-flow.md)
16. [Navigation Best Practices](./16-navigation-best-practices.md)
17. [Security in Frontend](./17-security-frontend.md)
18. [UX Micro-Patterns](./18-ux-micro-patterns.md)
19. [Testing (React)](./19-testing-react.md)
20. [Build & Deployment](./20-build-deployment.md)
21. [Offline Support / PWA](./21-offline-support-pwa.md)
22. [Infinite Scroll](./22-infinite-scroll.md)
23. [File Previews](./23-file-previews.md)
24. [Real-Time UI Patterns](./24-realtime-ui-patterns.md)
25. [Error Logging Tools](./25-error-logging-tools.md)
26. [Feature Flags](./26-feature-flags.md)
27. [Layout Patterns for Dashboards](./27-layout-patterns-dashboards.md)
28. [Performance Budgets](./28-performance-budgets.md)
29. [Tracking and Analytics](./29-tracking-analytics.md)

## How to Use

Each file covers a specific topic with:
- Clear guidelines and patterns
- Code examples (when applicable)
- Best practices specific to this project
- Common pitfalls to avoid

## Project-Specific Rules

- **Path Aliases**: Always use `@/` for imports
- **Design System**: Use `@/shared/design-system` only
- **Constants**: Extract all hardcoded strings to constants
- **i18n**: All user-facing text must use translations
- **File Size**: Keep components under 300 lines
- **TypeScript**: Strict mode, no `any` types

## Contributing

When adding new patterns or updating existing ones:
1. Keep files between 50-70 lines
2. Include practical examples
3. Reference project-specific implementations
4. Update this README if adding new topics

