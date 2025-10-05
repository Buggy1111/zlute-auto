# E2E Testing Documentation - Žluté Auto

## Overview

This document describes the End-to-End (E2E) testing setup for the Žluté Auto application. The tests are built using **Playwright**, a modern testing framework that provides excellent support for Next.js applications, multiple browsers, and mobile viewports.

## Why Playwright?

Playwright was chosen for this project because:

- **Excellent Next.js Support**: Works seamlessly with Next.js 15 and React 19
- **Multi-Browser Testing**: Tests run on Chrome, Firefox, and Safari
- **Mobile Testing**: Built-in device emulation for mobile viewports
- **Fast & Reliable**: Auto-waiting, parallel execution, and retry mechanisms
- **Great Developer Experience**: UI mode, debugging tools, and detailed reports
- **TypeScript Support**: First-class TypeScript support out of the box

## Installation

### 1. Install Playwright Browsers

After cloning the repository, install the required browsers:

```bash
npm run playwright:install
```

This downloads Chromium, Firefox, and WebKit (Safari) browsers needed for testing.

### 2. Verify Installation

Check that Playwright is installed correctly:

```bash
npx playwright --version
```

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step-by-step
npm run test:e2e:debug
```

### Browser-Specific Tests

```bash
# Run tests only in Chrome
npm run test:e2e:chrome

# Run tests only in Firefox
npm run test:e2e:firefox

# Run tests only in Safari
npm run test:e2e:safari

# Run mobile tests (Mobile Chrome + Mobile Safari)
npm run test:e2e:mobile
```

### View Test Reports

```bash
# Open the HTML report from last test run
npm run test:e2e:report
```

## Test Structure

### Test Files

All E2E tests are located in the `e2e/` directory:

```
e2e/
├── helpers.ts                  # Test utility functions
├── home.spec.ts               # Home page and game creation tests
├── game.spec.ts               # Game functionality tests
├── navigation.spec.ts         # Navigation modal and deep links tests
├── results.spec.ts            # Leaderboard and game results tests
└── pwa-accessibility.spec.ts  # PWA features and accessibility tests
```

### Test Coverage

#### 1. Home Page Tests (`home.spec.ts`)
- ✅ Page rendering and layout
- ✅ Adding/removing players (2-8 players)
- ✅ Player name validation and sanitization
- ✅ Game creation flow
- ✅ Mobile viewport support
- ✅ Menu and share functionality

#### 2. Game Functionality Tests (`game.spec.ts`)
- ✅ Game creation and loading
- ✅ Adding points to players
- ✅ Rate limiting (anti-spam)
- ✅ Multiple players support
- ✅ Player selection dropdown
- ✅ Ending game and showing results
- ✅ State persistence on reload
- ✅ Invalid game ID handling
- ✅ Challenge toast notifications
- ✅ Game timer functionality

#### 3. Navigation Modal Tests (`navigation.spec.ts`)
- ✅ Opening navigation modal
- ✅ All navigation app options (Google Maps, Waze, Mapy.cz, Apple Maps)
- ✅ Deep link functionality
- ✅ Instructions and tips display
- ✅ Android split-screen tip
- ✅ Wake lock information
- ✅ Modal close functionality
- ✅ State preservation after modal usage

#### 4. Results & Leaderboard Tests (`results.spec.ts`)
- ✅ Game results display
- ✅ Winner detection
- ✅ Final scores for all players
- ✅ Game duration display
- ✅ Creating new game from results
- ✅ Game history/events
- ✅ Tie scenario handling
- ✅ Achievement notifications
- ✅ Results sharing
- ✅ Medal emojis for top players
- ✅ Results persistence on reload

#### 5. PWA & Accessibility Tests (`pwa-accessibility.spec.ts`)
- ✅ PWA manifest
- ✅ Meta tags (viewport, theme-color)
- ✅ Page title and SEO
- ✅ Semantic HTML structure
- ✅ Keyboard navigation
- ✅ Screen reader support (ARIA labels)
- ✅ Service worker registration
- ✅ Color contrast
- ✅ Touch event support
- ✅ Screen orientation changes
- ✅ Responsive design at various breakpoints
- ✅ Reduced motion preferences
- ✅ Network error handling
- ✅ Fast initial load time

## Test Utilities (helpers.ts)

The `helpers.ts` file provides reusable functions for tests:

- `fillPlayerNames(page, names)` - Fill in player names on home page
- `startGame(page, playerNames)` - Create and start a new game
- `addPoint(page, playerName)` - Add a point to a specific player
- `waitForGameReady(page)` - Wait for game to load completely
- `endGame(page)` - End the current game
- `openGameMenu(page)` - Open the hamburger menu
- `closeModal(page)` - Close any open modal
- `getPlayerScore(page, playerName)` - Get current score for a player
- `selectPlayer(page, playerName)` - Select player in dropdown
- `waitForToast(page, expectedText)` - Wait for toast notification

## Configuration

The test configuration is in `playwright.config.ts`:

### Key Settings

- **Test Directory**: `./e2e`
- **Timeout**: 60 seconds per test
- **Workers**: 1 (sequential execution to avoid Firebase conflicts)
- **Retries**: 2 in CI, 0 locally
- **Base URL**: `http://localhost:3000`
- **Screenshots**: Captured on failure
- **Video**: Recorded on retry

### Test Projects

Tests run on 5 different configurations:

1. **Desktop Chrome** (1280x720)
2. **Desktop Firefox** (1280x720)
3. **Desktop Safari** (1280x720)
4. **Mobile Chrome** (Pixel 5 viewport)
5. **Mobile Safari** (iPhone 12 viewport)

## Firebase Integration

### Important Notes

The tests interact with real Firebase Firestore. Before running tests:

1. **Environment Variables**: Ensure `.env.local` has Firebase credentials
2. **Firebase Rules**: Tests create real games in your Firebase project
3. **Test Isolation**: Each test creates a new game with unique player names
4. **Cleanup**: Games created by tests remain in Firebase (consider periodic cleanup)

### Best Practices

- Use unique player names in each test to avoid conflicts
- Wait for Firebase updates to propagate (use `page.waitForTimeout(2000)`)
- Don't run tests in parallel (configured to use 1 worker)

## Debugging Tests

### UI Mode (Recommended)

```bash
npm run test:e2e:ui
```

UI mode provides:
- Visual test runner
- Step-by-step execution
- Time travel debugging
- Screenshots at each step
- Network activity inspector

### Debug Mode

```bash
npm run test:e2e:debug
```

Debug mode opens Playwright Inspector with:
- Breakpoints
- Step through commands
- Console logging
- DOM snapshots

### VSCode Integration

Install the [Playwright VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for:
- Running tests from VSCode
- Debugging with breakpoints
- Test explorer sidebar
- Code generation

## Writing New Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { startGame, waitForGameReady } from './helpers';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Setup
    await startGame(page, ['Player1', 'Player2']);
    await waitForGameReady(page);

    // Action
    await page.click('button:has-text("Player1")');

    // Assertion
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Helpers**: Leverage helper functions from `helpers.ts`
2. **Wait for Updates**: Firebase updates need time to propagate
3. **Unique Names**: Use unique player names to avoid test conflicts
4. **Clear Assertions**: Use specific locators and expect conditions
5. **Error Handling**: Test both success and error cases
6. **Mobile Testing**: Always test mobile viewports for responsive features

## Common Issues & Solutions

### Issue: Tests Fail Due to Timing

**Solution**: Increase wait times for Firebase updates
```typescript
await page.waitForTimeout(2500); // Instead of 1000
```

### Issue: Element Not Found

**Solution**: Wait for element to be visible
```typescript
await expect(page.locator('button')).toBeVisible({ timeout: 5000 });
```

### Issue: Firebase Connection Errors

**Solution**:
- Check `.env.local` has correct Firebase credentials
- Ensure Firebase project is accessible
- Verify Firestore rules allow test operations

### Issue: Tests Pass Locally But Fail in CI

**Solution**:
- Check CI has proper environment variables
- Increase timeouts for CI environment
- Ensure dev server starts before tests run

## Continuous Integration (CI)

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          # ... other Firebase env vars
```

## Performance Considerations

- **Parallel Execution**: Disabled due to Firebase conflicts (1 worker)
- **Test Duration**: Average test takes 5-15 seconds
- **Full Suite**: Approximately 5-10 minutes for all browsers
- **Mobile Tests**: Slightly faster than desktop (simpler rendering)

## Test Maintenance

### Regular Updates

1. **Update Playwright**: `npm install -D @playwright/test@latest`
2. **Update Browsers**: `npm run playwright:install`
3. **Review Failures**: Check HTML report after failures
4. **Update Selectors**: Keep locators up-to-date with UI changes

### Adding New Features

When adding new features to the app:

1. Write E2E tests alongside feature development
2. Test both happy path and error cases
3. Test mobile and desktop viewports
4. Update this documentation with new test coverage

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)
- [Firebase Testing Guide](https://firebase.google.com/docs/rules/unit-tests)

## Support

For questions or issues with E2E tests:

1. Check this documentation
2. Review test failure reports
3. Check Playwright documentation
4. Open an issue with test failure details
