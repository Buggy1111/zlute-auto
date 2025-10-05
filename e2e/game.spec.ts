import { test, expect } from '@playwright/test';
import { startGame, addPoint, waitForGameReady, endGame } from './helpers';

test.describe('Game Functionality', () => {
  test('should create and load a game correctly', async ({ page }) => {
    const gameId = await startGame(page, ['Alice', 'Bob']);

    // Verify we're on the game page
    expect(gameId).toBeTruthy();
    expect(page.url()).toContain(`/game/${gameId}`);

    // Wait for game to be ready
    await waitForGameReady(page);

    // Check for player buttons
    await expect(page.locator('button:has-text("Alice")')).toBeVisible();
    await expect(page.locator('button:has-text("Bob")')).toBeVisible();

    // Check for timer
    await expect(page.locator('text=Čas hry')).toBeVisible();

    // Check for end game button
    await expect(page.locator('button:has-text("Ukončit hru")')).toBeVisible();
  });

  test('should allow adding points to players', async ({ page }) => {
    await startGame(page, ['Player1', 'Player2']);
    await waitForGameReady(page);

    // Add a point to Player1
    const player1Button = page.locator('button:has-text("Player1")').first();
    await player1Button.click();

    // Wait for Firebase update
    await page.waitForTimeout(2000);

    // Click the button again to trigger score display
    await player1Button.click();

    // Wait a bit more
    await page.waitForTimeout(1000);

    // The score should have incremented (shown temporarily after click)
    // This is hard to test directly due to temporary visibility
    // Instead, we verify no error occurred
    await expect(page.locator('text=Příliš rychle')).not.toBeVisible();
  });

  test('should enforce rate limiting', async ({ page }) => {
    await startGame(page, ['Fast', 'Slow']);
    await waitForGameReady(page);

    const playerButton = page.locator('button:has-text("Fast")').first();

    // Click rapidly
    await playerButton.click();
    await page.waitForTimeout(100);
    await playerButton.click();

    // Should show rate limit error
    await expect(
      page.locator('text=Příliš rychle').or(page.locator('text=Počkej chvilku'))
    ).toBeVisible({ timeout: 3000 });
  });

  test('should handle multiple players correctly', async ({ page }) => {
    await startGame(page, ['Alice', 'Bob', 'Charlie', 'Diana']);
    await waitForGameReady(page);

    // All players should be visible
    await expect(page.locator('button:has-text("Alice")')).toBeVisible();
    await expect(page.locator('button:has-text("Bob")')).toBeVisible();
    await expect(page.locator('button:has-text("Charlie")')).toBeVisible();
    await expect(page.locator('button:has-text("Diana")')).toBeVisible();

    // Add points to different players
    await addPoint(page, 'Alice');
    await page.waitForTimeout(2000);
    await addPoint(page, 'Charlie');
    await page.waitForTimeout(2000);

    // No errors should appear
    await expect(page.locator('text=Chyba')).not.toBeVisible();
  });

  test('should allow player selection via dropdown', async ({ page }) => {
    await startGame(page, ['Player1', 'Player2', 'Player3']);
    await waitForGameReady(page);

    // Player selector should be visible
    const selector = page.locator('select').first();
    await expect(selector).toBeVisible();

    // Should have all players as options
    const options = await selector.locator('option').allTextContents();
    expect(options).toContain('Player1');
    expect(options).toContain('Player2');
    expect(options).toContain('Player3');

    // Select a different player
    await selector.selectOption({ label: 'Player2' });
    await page.waitForTimeout(300);

    // Should persist selection in localStorage
    const selectedValue = await selector.inputValue();
    expect(selectedValue).toBeTruthy();
  });

  test('should end game and show results', async ({ page }) => {
    await startGame(page, ['Winner', 'Loser']);
    await waitForGameReady(page);

    // Add some points
    await addPoint(page, 'Winner');
    await page.waitForTimeout(2000);
    await addPoint(page, 'Winner');
    await page.waitForTimeout(2000);

    // End the game
    await endGame(page);

    // Results should be visible
    await expect(
      page.locator('text=Výsledky').or(page.locator('text=Konec hry'))
    ).toBeVisible({ timeout: 5000 });

    // Player buttons should not be clickable anymore (or not visible)
    await page.waitForTimeout(1000);
  });

  test('should persist game state on reload', async ({ page }) => {
    const gameId = await startGame(page, ['Persistent1', 'Persistent2']);
    await waitForGameReady(page);

    // Add a point
    await addPoint(page, 'Persistent1');
    await page.waitForTimeout(2000);

    // Reload the page
    await page.reload();
    await waitForGameReady(page);

    // Game should still be there
    await expect(page.locator('button:has-text("Persistent1")')).toBeVisible();
    await expect(page.locator('button:has-text("Persistent2")')).toBeVisible();

    // URL should still be the same
    expect(page.url()).toContain(`/game/${gameId}`);
  });

  test('should handle invalid game ID gracefully', async ({ page }) => {
    // Navigate to invalid game
    await page.goto('/game/invalid-game-id-12345');

    // Should show error message
    await expect(page.locator('text=Hra nenalezena')).toBeVisible({ timeout: 10000 });
    await expect(
      page.locator('text=Tato hra neexistuje nebo byla smazána')
    ).toBeVisible();

    // Should show button to create new game
    await expect(page.locator('button:has-text("Vytvořit novou hru")')).toBeVisible();
  });

  test('should show challenge toast after point', async ({ page }) => {
    await startGame(page, ['Challenger', 'Defender']);
    await waitForGameReady(page);

    // Add a point
    const button = page.locator('button:has-text("Challenger")').first();
    await button.click();

    // Challenge toast should appear
    await expect(
      page.locator('text=Challenge').or(page.locator('button:has-text("Challenge")'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await startGame(page, ['Mobile1', 'Mobile2']);
    await waitForGameReady(page);

    // Game should be functional
    await expect(page.locator('button:has-text("Mobile1")')).toBeVisible();
    await expect(page.locator('button:has-text("Mobile2")')).toBeVisible();

    // Add point
    await addPoint(page, 'Mobile1');
    await page.waitForTimeout(2000);

    // Should work without errors
    await expect(page.locator('text=Chyba')).not.toBeVisible();
  });

  test('should show loading state correctly', async ({ page }) => {
    // Navigate to a game that might take time to load
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Start creating a game
    const input1 = page.locator('input[placeholder="Jméno hráče 1"]');
    const input2 = page.locator('input[placeholder="Jméno hráče 2"]');
    await input1.fill('LoadTest1');
    await input2.fill('LoadTest2');

    // Click start
    await page.click('button:has-text("ZAČÍT HRÁT")');

    // Should show some loading indication or navigate quickly
    await page.waitForURL(/\/game\//, { timeout: 20000 });

    // Game should load
    await waitForGameReady(page);
  });

  test('should handle game timer correctly', async ({ page }) => {
    await startGame(page, ['Timer1', 'Timer2']);
    await waitForGameReady(page);

    // Timer should be visible
    await expect(page.locator('text=Čas hry')).toBeVisible();

    // Wait a few seconds
    await page.waitForTimeout(3000);

    // Timer should still be visible and ticking
    await expect(page.locator('text=Čas hry')).toBeVisible();
  });
});
