import { Page, expect } from '@playwright/test';

/**
 * Test helpers for Žluté Auto E2E tests
 */

/**
 * Fill in player names on the home page
 */
export async function fillPlayerNames(page: Page, names: string[]) {
  for (let i = 0; i < names.length; i++) {
    // Add player if we need more than the default 2 slots
    if (i >= 2) {
      await page.click('button:has-text("Přidat hráče")');
    }

    // Fill in the player name
    const input = page.locator(`input[placeholder="Jméno hráče ${i + 1}"]`);
    await input.fill(names[i]);
  }
}

/**
 * Start a new game with given player names
 * Returns the game ID extracted from the URL
 */
export async function startGame(page: Page, playerNames: string[]): Promise<string> {
  await page.goto('/');

  // Wait for page to load
  await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();

  // Fill in player names
  await fillPlayerNames(page, playerNames);

  // Click start game button
  await page.click('button:has-text("ZAČÍT HRÁT")');

  // Wait for navigation to game page
  await page.waitForURL(/\/game\/[^/]+/, { timeout: 20000 });

  // Extract game ID from URL
  const url = page.url();
  const match = url.match(/\/game\/([^/]+)/);
  if (!match) {
    throw new Error('Failed to extract game ID from URL');
  }

  return match[1];
}

/**
 * Add a point for a specific player by clicking their button
 */
export async function addPoint(page: Page, playerName: string) {
  const playerButton = page.locator(`button:has-text("${playerName}")`).first();
  await playerButton.click();

  // Wait a bit for the Firebase update to propagate
  await page.waitForTimeout(1500);
}

/**
 * Wait for the game to load and be ready
 */
export async function waitForGameReady(page: Page) {
  // Wait for the main game elements to be visible
  await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();

  // Wait for player buttons to be visible
  await expect(page.locator('button').first()).toBeVisible();
}

/**
 * End the current game
 */
export async function endGame(page: Page) {
  // Click end game button
  await page.click('button:has-text("Ukončit hru")');

  // Wait for results to appear
  await page.waitForTimeout(2000);
}

/**
 * Open the game menu
 */
export async function openGameMenu(page: Page) {
  // Look for the hamburger menu button (Menu icon)
  const menuButton = page.locator('button[aria-label="Menu"], button:has-text("☰")').first();
  await menuButton.click();

  // Wait for menu to open
  await page.waitForTimeout(500);
}

/**
 * Close any open modal by clicking the backdrop or close button
 */
export async function closeModal(page: Page) {
  const closeButton = page.locator('button[aria-label="Zavřít"]');
  if (await closeButton.isVisible()) {
    await closeButton.click();
  } else {
    // Click backdrop
    await page.locator('.fixed.inset-0.bg-black').first().click();
  }

  await page.waitForTimeout(300);
}

/**
 * Get the current score for a player
 */
export async function getPlayerScore(page: Page, playerName: string): Promise<number> {
  // Wait for score to be visible after click
  const scoreText = await page
    .locator(`button:has-text("${playerName}")`)
    .first()
    .textContent();

  if (!scoreText) {
    return 0;
  }

  // Extract number from text like "Hráč 1: 3" or just "3"
  const match = scoreText.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Wait for a toast message to appear
 */
export async function waitForToast(page: Page, expectedText?: string) {
  if (expectedText) {
    await expect(page.locator(`div:has-text("${expectedText}")`)).toBeVisible({
      timeout: 5000,
    });
  } else {
    // Just wait for any toast-like element
    await page.waitForTimeout(500);
  }
}

/**
 * Check if we're on the home page
 */
export async function isOnHomePage(page: Page): Promise<boolean> {
  const url = page.url();
  return url.endsWith('/') || url.includes('localhost:3000');
}

/**
 * Check if we're on a game page
 */
export async function isOnGamePage(page: Page): Promise<boolean> {
  const url = page.url();
  return url.includes('/game/');
}

/**
 * Select a specific player in the player selector dropdown
 */
export async function selectPlayer(page: Page, playerName: string) {
  const selector = page.locator('select').first();
  await selector.selectOption({ label: playerName });
  await page.waitForTimeout(300);
}

/**
 * Navigate to a specific URL with waiting
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
}
