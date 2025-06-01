# Common Vercel Deployment Issues & Solutions

Based on analysis of real-world deployment problems, this guide addresses the most frequent issues developers face with Vercel deployments.

## 1. File Not Found (ENOENT) Errors

### Symptoms
- Build fails with `ENOENT: no such file or directory`
- Files that exist locally aren't found on Vercel

### Solutions
- Check file path case sensitivity (Vercel runs on Linux)
```bash
# Find files with inconsistent casing
find . -type f -name "[A-Z]*" | sort
```
- Verify import paths match exact case of filenames
- For Shiki theme errors: bundle themes with your project
```js
// In your shiki configuration
import { getHighlighter } from 'shiki'
import theme from 'shiki/themes/one-dark-pro.json' // Import directly

const highlighter = await getHighlighter({
  theme: theme, // Use imported theme
})
```

## 2. 504 Gateway Timeouts

### Symptoms
- Pages show 504 errors, especially on first load
- Functions time out during cold starts

### Solutions
- Optimize serverless function size and startup time
- Configure function timeout in `vercel.json`:
```json
{
  "functions": {
    "api/*.js": {
      "maxDuration": 60
    }
  }
}
```
- Implement ISR or SSG for heavy pages
- Use Edge Functions for faster cold starts

## 3. Auth.js Integration Problems

### Symptoms
- Authentication callbacks fail after deployment
- Redirect loops during sign-in process

### Solutions
- Ensure callback URLs match between environments
```js
// In your auth.js configuration
callbacks: {
  redirect({ url, baseUrl }) {
    // Handle URL differences between environments
    return url.startsWith(baseUrl) ? url : baseUrl
  }
}
```
- Verify all required environment variables are set in Vercel
- Check for protocol mismatches (http vs https)

## 4. Database Connection Issues

### Symptoms
- Connection pool errors with Prisma
- "Too many connections" errors
- Timeouts connecting to Supabase

### Solutions
- Implement connection pooling for serverless environments
```js
// For Prisma, in your db.js file
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
- Use environment-specific connection strings
- For Supabase, use direct connection in serverless functions

## 5. Static Export Problems

### Symptoms
- Dynamic features break with static export
- API routes not working after deployment

### Solutions
- Verify `output: 'export'` is only used for truly static sites
- Remove server components and API routes for static exports
- Use client-side data fetching for dynamic content
- Consider hybrid rendering instead of full static export

## 6. E2E Testing Failures in CI

### Symptoms
- Tests pass locally but fail in GitHub Actions
- Timeouts or element not found errors in CI

### Solutions
- Increase test timeouts for CI environment
```ts
// In playwright.config.ts
export default defineConfig({
  timeout: process.env.CI ? 60000 : 30000,
  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },
});
```
- Add explicit waits for dynamic content
```ts
// Wait for specific element instead of fixed delay
await page.waitForSelector('.dynamic-content', { state: 'visible' });
```
- Use video recording to debug CI failures
```ts
// In playwright.config.ts
use: {
  video: process.env.CI ? 'on-first-retry' : 'off',
}
```
- Test against deployed preview URL
```yaml
# In GitHub workflow
- name: Run E2E tests against preview
  env:
    PLAYWRIGHT_TEST_BASE_URL: ${{ steps.deploy-preview.outputs.preview-url }}
  run: npx playwright test
```