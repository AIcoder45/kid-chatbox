# Build & Deployment

## Environment Variables Usage

**Naming**: Prefix with `VITE_` for Vite projects.

**Access**: `import.meta.env.VITE_API_URL`

**Files**:
- `.env` (local development)
- `.env.production` (production)
- `.env.example` (template, commit this)

**Never commit**: `.env` files with real values.

## Chunk Naming

**Vite Configuration**:
```typescript
build: {
  rollupOptions: {
    output: {
      chunkFileNames: 'assets/[name]-[hash].js',
      entryFileNames: 'assets/[name]-[hash].js',
      assetFileNames: 'assets/[name]-[hash].[ext]',
    },
  },
}
```

**Benefits**: Better caching, easier debugging.

## Asset Caching Strategy

**Cache Headers** (backend):
- Static assets: Long cache (1 year) with hash in filename
- HTML: No cache or short cache
- API responses: Appropriate cache headers

**Hash in Filenames**: Enables long cache for assets.

## Bundle Analysis

**Tools**:
- `vite-bundle-visualizer`
- `webpack-bundle-analyzer` (if using webpack)

**Analyze**:
- Largest dependencies
- Duplicate code
- Unused code

**Action**: Remove unused dependencies, code-split large libraries.

## Lighthouse Checks

**Run Before Deployment**:
- Performance score ≥ 90
- Accessibility score = 100
- Best Practices score ≥ 90
- SEO score ≥ 90

**CI/CD**: Integrate Lighthouse CI for automated checks.

**Fix Issues**: Address critical issues before release.

