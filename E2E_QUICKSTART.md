# E2E Testing Quick Start Guide

## Setup (First Time Only)

### 1. Install Playwright Browsers

```bash
npm run playwright:install
```

This downloads Chrome, Firefox, and Safari browsers needed for testing.

## Running Tests

### Recommended: UI Mode (Interactive)

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute in real-time
- Debug failures visually
- Time-travel through test steps

### Headless Mode (Fast)

```bash
npm run test:e2e
```

Runs all tests in headless mode (no browser window). Best for CI/CD.

### Headed Mode (Watch Tests Run)

```bash
npm run test:e2e:headed
```

Opens browser windows so you can watch tests execute.

### Debug Mode (Step Through)

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

## Specific Test Suites

```bash
# Run only specific test file
npx playwright test home.spec.ts

# Run only one test by name
npx playwright test -g "should display the home page"

# Run mobile tests only
npm run test:e2e:mobile

# Run Chrome tests only
npm run test:e2e:chrome
```

## View Test Results

```bash
npm run test:e2e:report
```

Opens HTML report with:
- Test results
- Screenshots of failures
- Video recordings (if available)
- Detailed error messages

## Common Workflows

### Before Committing Code

```bash
# Quick check
npm run test:e2e:chrome

# Full check (all browsers)
npm run test:e2e
```

### Debugging a Failing Test

```bash
# Option 1: UI Mode
npm run test:e2e:ui
# Then click on the failing test and watch it

# Option 2: Debug Mode
npm run test:e2e:debug
# Step through the test line by line
```

### Writing New Tests

1. Create a new file in `e2e/` folder (e.g., `e2e/myfeature.spec.ts`)
2. Use helpers from `e2e/helpers.ts`
3. Run in UI mode: `npm run test:e2e:ui`
4. Watch your test execute and debug

## Quick Tips

- **Tests are slow?** Check Firebase connection and wait times
- **Random failures?** Increase timeouts in test code
- **Need to skip a test?** Use `test.skip()` temporarily
- **Want to focus on one test?** Use `test.only()`
- **Tests not found?** Make sure file ends with `.spec.ts`

## Test File Overview

- `home.spec.ts` - Home page, game creation
- `game.spec.ts` - Game play, scoring, rate limiting
- `navigation.spec.ts` - Navigation modal, deep links
- `results.spec.ts` - Game results, leaderboard
- `pwa-accessibility.spec.ts` - PWA features, accessibility

## Need Help?

See detailed documentation: `E2E_TESTING.md`
