# Vercel Deployment Checklist - Production Ready

## Pre-Deployment Setup (One-Time)

### CLI & Tools Setup
- [ ] **Update Vercel CLI**: `npm i -g vercel@latest`
- [ ] **Verify CLI version**: `vercel --version` (should be latest)
- [ ] **Login to Vercel**: `vercel login`
- [ ] **Install 1Password CLI** (for secure credential management): `brew install 1password-cli`
- [ ] **Set up Git hooks** for pre-commit checks

### Project Configuration
- [ ] **Link project**: `vercel link --yes`
- [ ] **Verify project settings** in Vercel dashboard
- [ ] **Set up team/scope** if applicable: `--scope your-team-name`
- [ ] **Configure build settings** in vercel.json or dashboard

---

## Every Deployment Checklist

### 🔍 Pre-Deployment Validation

#### Code Quality
- [ ] **Run linting**: `npm run lint` or `yarn lint`
- [ ] **Run type checking**: `npm run type-check` or `tsc --noEmit`
- [ ] **Run tests**: `npm test` or `yarn test`
- [ ] **Run E2E tests**: `npm run test:e2e` or `yarn test:e2e`
- [ ] **Check build locally**: `npm run build` or `yarn build`
- [ ] **Verify no console errors/warnings** in build output

#### Environment & Configuration
- [ ] **List current env vars**: `vercel env ls`
- [ ] **Pull latest env vars**: `vercel env pull .env.production`
- [ ] **Verify required variables** are set for target environment
- [ ] **Check vercel.json** configuration is up to date
- [ ] **Confirm Node.js version** matches production (check `.nvmrc` or `engines` in package.json)

#### Dependencies & Security
- [ ] **Update package lock**: `npm ci` or `yarn install --frozen-lockfile`
- [ ] **Check for security vulnerabilities**: `npm audit` or `yarn audit`
- [ ] **Verify no exposed secrets** in code (use tools like `git-secrets`)
- [ ] **Review .gitignore** and .vercelignore files

### 🚀 Deployment Process

#### Database Preparation (if applicable)
- [ ] **Backup production data** before schema changes
- [ ] **Test database migrations** locally or in staging
- [ ] **Verify connection string** format and access
- [ ] **Use Neon SQL Editor** for complex database operations
- [ ] **Wrap schema changes in transactions**:
  ```sql
  BEGIN;
  -- Your schema changes
  COMMIT;
  ```

#### Deployment Execution
- [ ] **Deploy to preview first**: `vercel --prod=false`
- [ ] **Run E2E tests against preview**: `PLAYWRIGHT_TEST_BASE_URL=https://preview-url.vercel.app npm run test:e2e`
- [ ] **Test preview deployment** thoroughly
- [ ] **Deploy to production**: `vercel --prod`
- [ ] **Monitor deployment logs**: `vercel logs --follow`
- [ ] **Verify deployment URL** is accessible

### ✅ Post-Deployment Verification

#### Functional Testing
- [ ] **Test critical user flows** on production
- [ ] **Verify API endpoints** are responding correctly
- [ ] **Check database connections** are working
- [ ] **Test authentication flows** if applicable
- [ ] **Verify static assets** are loading correctly
- [ ] **Run E2E tests against production**: `PLAYWRIGHT_TEST_BASE_URL=https://your-app.vercel.app npm run test:e2e`

#### Performance & Monitoring
- [ ] **Check Core Web Vitals** in Vercel Analytics
- [ ] **Verify build time** is within acceptable range
- [ ] **Monitor error rates** in first hour post-deployment
- [ ] **Check function execution times** if using serverless functions

---

## Troubleshooting Quick Reference

### Common CLI Issues & Solutions

#### Environment Variables
```bash
# If env pull fails
vercel link --yes  # Re-link project first
vercel env pull --environment=production

# List all environments
vercel env ls

# Add new environment variable
vercel env add VARIABLE_NAME production
```

#### Build & Deployment Issues
```bash
# Clear Vercel cache
vercel --debug

# Force rebuild
vercel --force

# Check build logs
vercel logs --scope your-team-name
```

#### Database Connection Problems
```bash
# Use Neon dashboard instead of CLI for complex operations
# Store connection strings securely in 1Password
op item create --category="Database" --vault="Projects" \
  --title="Project DB" "connection-string=postgres://..."

# Test connection
psql "$(op read 'op://Projects/Project DB/connection-string')" -c "SELECT 1;"
```

### Emergency Rollback
```bash
# Quick rollback to previous deployment
vercel rollback

# Or specify deployment URL
vercel rollback https://your-app-abc123.vercel.app
```

---

## Automation & Best Practices

### GitHub Actions Integration
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### E2E Testing with Playwright
```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Package.json Scripts
```json
{
  "scripts": {
    "predeploy": "npm run lint && npm run test && npm run test:e2e && npm run build",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",
    "env:pull": "vercel env pull",
    "logs": "vercel logs --follow",
    "test:e2e": "playwright test"
  }
}
```

### Local Development Setup
```bash
# Create local environment file
vercel env pull .env.local

# Set up development database (optional)
docker run --name postgres-dev -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres

# Install recommended VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-playwright.playwright
```

---

## Security Checklist

### Credential Management
- [ ] **Never commit secrets** to version control
- [ ] **Use Vercel environment variables** for sensitive data
- [ ] **Store backup credentials** in 1Password with proper labeling
- [ ] **Rotate secrets regularly** (database passwords, API keys)
- [ ] **Use environment-specific values** (different keys for dev/staging/prod)

### API Security
- [ ] **Verify API routes** have proper authentication
- [ ] **Check CORS settings** are restrictive enough
- [ ] **Validate all inputs** on server-side
- [ ] **Use HTTPS everywhere** (Vercel handles this automatically)

---

## Documentation & Maintenance

### Keep Updated
- [ ] **Document successful CLI commands** for team reference
- [ ] **Log deployment issues and solutions** in team wiki
- [ ] **Update this checklist** based on new learnings
- [ ] **Review and update dependencies** monthly
- [ ] **Monitor Vercel changelog** for breaking changes

### Team Collaboration
- [ ] **Share deployment credentials** securely via 1Password
- [ ] **Document project-specific requirements** in README
- [ ] **Set up deployment notifications** in team Slack/Discord
- [ ] **Create deployment runbook** for emergency situations

---

## Quick Command Reference

```bash
# Essential Vercel CLI commands
vercel --version              # Check CLI version
vercel login                  # Authenticate
vercel link                   # Link local project
vercel                        # Deploy to preview
vercel --prod                 # Deploy to production
vercel env ls                 # List environment variables
vercel env pull               # Download environment variables
vercel logs                   # View function logs
vercel rollback              # Rollback deployment
vercel domains               # Manage custom domains
vercel certs                 # Manage SSL certificates

# Playwright E2E testing commands
npx playwright install        # Install browsers
npx playwright test           # Run all tests
npx playwright test --ui      # Run tests with UI
npx playwright test --debug   # Debug tests
```

By following this checklist systematically, you'll minimize deployment issues and ensure consistent, reliable deployments to Vercel.