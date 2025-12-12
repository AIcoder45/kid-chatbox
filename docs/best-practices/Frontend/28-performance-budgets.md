# Performance Budgets

## Bundle Size Budgets

**Set Limits**:
- Initial bundle: < 200KB (gzipped)
- Total bundle: < 500KB (gzipped)
- Individual chunks: < 100KB (gzipped)

**Monitor**: Use bundle analyzer, fail CI if exceeded.

## Load Time Budgets

**Targets**:
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s

**Measure**: Use Lighthouse, WebPageTest.

## Runtime Performance

**JavaScript Execution**:
- Main thread blocking: < 50ms
- Long tasks: < 100ms
- Total blocking time: < 200ms

**Monitor**: Use Chrome DevTools Performance tab.

## Image Budgets

**Image Sizes**:
- Hero images: < 200KB
- Thumbnails: < 50KB
- Icons: < 10KB

**Format**: Use WebP with fallback, optimize images.

## Network Budgets

**Total Page Weight**: < 2MB (including images)

**Critical Resources**: Load critical CSS/JS inline or preload.

**Defer Non-Critical**: Load below-the-fold content lazily.

## CI/CD Integration

**Automated Checks**: Fail build if budgets exceeded.

**Tools**: `bundlesize`, `lighthouse-ci`.

**Reports**: Generate performance reports in CI.

