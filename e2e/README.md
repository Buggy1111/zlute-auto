# E2E Test Suite - Žluté Auto

This directory contains all End-to-End tests for the Žluté Auto application.

## Test Files

### `helpers.ts`
Shared utility functions used across all test files.

**Key Functions:**
- `startGame()` - Create and navigate to a new game
- `addPoint()` - Add a point to a player
- `endGame()` - End the current game
- `waitForGameReady()` - Wait for game to load
- `fillPlayerNames()` - Fill in player names on home page
- `openGameMenu()` - Open the hamburger menu
- And more...

### `home.spec.ts` (12 tests)
Tests for the home page and game creation flow.

**Coverage:**
- Page rendering and layout
- Adding/removing players (2-8 limit)
- Player name validation (max 20 chars, sanitization)
- Game creation and redirect
- Mobile viewport support
- Menu and share functionality

### `game.spec.ts` (12 tests)
Tests for core game functionality during play.

**Coverage:**
- Game loading and state
- Adding points to players
- Rate limiting (anti-spam protection)
- Multiple players (4+ players)
- Player selection dropdown
- Ending game
- State persistence on reload
- Invalid game ID error handling
- Challenge toast notifications
- Game timer

### `navigation.spec.ts` (10 tests)
Tests for the navigation modal and deep links feature.

**Coverage:**
- Opening navigation modal from menu
- All navigation app options (Google Maps, Waze, Mapy.cz, Apple Maps)
- Deep link functionality
- Instructions display
- Android split-screen tip
- Wake lock information
- Modal close (button & backdrop)
- State preservation
- Mobile viewport

### `results.spec.ts` (12 tests)
Tests for game results, leaderboard, and game completion.

**Coverage:**
- Results display after game end
- Winner detection and highlighting
- Final scores for all players
- Game duration display
- Creating new game from results
- Game history/events log
- Tie scenario handling
- Achievement notifications
- Results sharing
- Medal emojis (🥇🥈🥉)
- Results persistence on reload

### `pwa-accessibility.spec.ts` (17 tests)
Tests for Progressive Web App features and accessibility.

**Coverage:**
- PWA manifest and meta tags
- Service worker registration
- Semantic HTML structure
- Keyboard navigation
- Screen reader support (ARIA)
- Touch event support
- Color contrast
- Screen orientation changes
- Responsive design (5 breakpoints)
- Reduced motion preferences
- Network error handling
- Fast load times
- Install prompt support

## Total Test Count

**71 E2E tests** covering all major features of the application.

## Test Execution

Tests run on **5 different configurations**:
1. Desktop Chrome (1280x720)
2. Desktop Firefox (1280x720)
3. Desktop Safari (1280x720)
4. Mobile Chrome (Pixel 5)
5. Mobile Safari (iPhone 12)

**Total test runs**: 71 tests × 5 configurations = **355 test executions** per full run

## Running Tests

See parent directory documentation:
- `E2E_QUICKSTART.md` - Quick start guide
- `E2E_TESTING.md` - Comprehensive documentation

Quick command:
```bash
npm run test:e2e:ui
```

## Test Naming Convention

Tests follow this pattern:
```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // test code
  });
});
```

## Adding New Tests

1. Create a new `.spec.ts` file or add to existing one
2. Import helpers: `import { startGame, addPoint } from './helpers'`
3. Write test using Playwright API
4. Run in UI mode to verify: `npm run test:e2e:ui`
5. Update this README with new test count

## Test Quality Standards

- ✅ Each test is independent (no shared state)
- ✅ Tests use unique player names
- ✅ Proper waiting for Firebase updates (2-2.5s delays)
- ✅ Clear test descriptions
- ✅ Both happy path and error cases covered
- ✅ Mobile and desktop viewports tested
- ✅ Accessibility considered

## Firebase Considerations

These tests interact with **real Firebase Firestore**:
- Each test creates actual game documents
- Games persist after test completion
- Use unique player names to avoid conflicts
- Sequential execution (1 worker) prevents race conditions
- Consider periodic Firebase cleanup of test data

## Maintenance

Update tests when:
- UI components change
- New features are added
- Existing features are modified
- Firebase structure changes
- Accessibility requirements change

Keep test count and coverage updated in this README.
