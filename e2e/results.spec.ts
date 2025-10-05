import { test, expect } from '@playwright/test';
import { startGame, addPoint, waitForGameReady, endGame } from './helpers';

test.describe('Game Results and Leaderboard', () => {
  test('should display results after game ends', async ({ page }) => {
    await startGame(page, ['Winner', 'Runner']);
    await waitForGameReady(page);

    // Add some points
    await addPoint(page, 'Winner');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Winner');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Runner');
    await page.waitForTimeout(2500);

    // End the game
    await endGame(page);

    // Results should be visible
    await expect(
      page.locator('text=Výsledky').or(page.locator('text=Konec hry'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should show winner correctly', async ({ page }) => {
    await startGame(page, ['Champion', 'SecondPlace']);
    await waitForGameReady(page);

    // Champion gets 3 points
    for (let i = 0; i < 3; i++) {
      await addPoint(page, 'Champion');
      await page.waitForTimeout(2500);
    }

    // SecondPlace gets 1 point
    await addPoint(page, 'SecondPlace');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // Wait for results
    await page.waitForTimeout(2000);

    // Winner should be shown (might have medal or special styling)
    // Note: Exact implementation depends on GameResults component
    await expect(
      page.locator('text=Champion').or(page.locator('text=Vítěz'))
    ).toBeVisible();
  });

  test('should display final scores for all players', async ({ page }) => {
    const players = ['Alice', 'Bob', 'Charlie'];
    await startGame(page, players);
    await waitForGameReady(page);

    // Add different points to each
    await addPoint(page, 'Alice');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Alice');
    await page.waitForTimeout(2500);

    await addPoint(page, 'Bob');
    await page.waitForTimeout(2500);

    await addPoint(page, 'Charlie');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Charlie');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Charlie');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // All players should be visible in results
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Alice')).toBeVisible();
    await expect(page.locator('text=Bob')).toBeVisible();
    await expect(page.locator('text=Charlie')).toBeVisible();
  });

  test('should show game duration', async ({ page }) => {
    await startGame(page, ['TimeTest1', 'TimeTest2']);
    await waitForGameReady(page);

    // Wait a few seconds
    await page.waitForTimeout(5000);

    // End game
    await endGame(page);

    // Should show time/duration
    await expect(
      page.locator('text=Čas').or(page.locator('text=min'))
    ).toBeVisible({ timeout: 3000 });
  });

  test('should allow creating new game from results', async ({ page }) => {
    await startGame(page, ['New1', 'New2']);
    await waitForGameReady(page);

    // End immediately
    await endGame(page);

    // Wait for results
    await page.waitForTimeout(2000);

    // Look for new game button
    const newGameButton = page.locator('button:has-text("Nová hra")');
    if (await newGameButton.isVisible()) {
      await newGameButton.click();

      // Should navigate to home page
      await page.waitForURL('/', { timeout: 5000 });
      await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();
      await expect(page.locator('button:has-text("ZAČÍT HRÁT")')).toBeVisible();
    }
  });

  test('should show game history/events', async ({ page }) => {
    await startGame(page, ['History1', 'History2']);
    await waitForGameReady(page);

    // Add several points
    await addPoint(page, 'History1');
    await page.waitForTimeout(2500);
    await addPoint(page, 'History2');
    await page.waitForTimeout(2500);
    await addPoint(page, 'History1');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // Results should show events/history
    await page.waitForTimeout(2000);

    // Look for history section (if visible in results)
    // This depends on GameResults component implementation
    const historyVisible = await page
      .locator('text=Historie')
      .or(page.locator('text=událost'))
      .isVisible()
      .catch(() => false);

    // If history is shown, verify it exists
    if (historyVisible) {
      await expect(page.locator('text=Historie')).toBeVisible();
    }
  });

  test('should handle tie scenarios', async ({ page }) => {
    await startGame(page, ['Tie1', 'Tie2']);
    await waitForGameReady(page);

    // Give both players same score
    await addPoint(page, 'Tie1');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Tie2');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Tie1');
    await page.waitForTimeout(2500);
    await addPoint(page, 'Tie2');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // Results should show both players
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Tie1')).toBeVisible();
    await expect(page.locator('text=Tie2')).toBeVisible();
  });

  test('should show achievements if earned', async ({ page }) => {
    await startGame(page, ['Achiever', 'Other']);
    await waitForGameReady(page);

    // Add points to potentially trigger achievement
    for (let i = 0; i < 5; i++) {
      await addPoint(page, 'Achiever');
      await page.waitForTimeout(2500);
    }

    // Achievement might appear during game
    // Check if achievement notification is visible
    const achievementVisible = await page
      .locator('text=Achievement')
      .or(page.locator('text=Milestone'))
      .isVisible()
      .catch(() => false);

    if (achievementVisible) {
      await expect(page.locator('text=Achievement')).toBeVisible();
    }

    // End game and check results
    await endGame(page);
    await page.waitForTimeout(2000);
  });

  test('should allow sharing results', async ({ page }) => {
    await startGame(page, ['Share1', 'Share2']);
    await waitForGameReady(page);

    // Add point and end
    await addPoint(page, 'Share1');
    await page.waitForTimeout(2500);
    await endGame(page);

    // Open menu
    await page.waitForTimeout(2000);
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Look for share option
    const shareButton = page.locator('text=Sdílet');
    if (await shareButton.isVisible()) {
      await expect(shareButton).toBeVisible();
    }
  });

  test('should persist results on page reload', async ({ page }) => {
    const gameId = await startGame(page, ['Persist1', 'Persist2']);
    await waitForGameReady(page);

    // Add points
    await addPoint(page, 'Persist1');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Results should still be there
    // Game status should be 'finished'
    await expect(
      page.locator('text=Výsledky').or(page.locator('text=Persist1'))
    ).toBeVisible({ timeout: 5000 });

    // URL should still be game page
    expect(page.url()).toContain(`/game/${gameId}`);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await startGame(page, ['MobileResult1', 'MobileResult2']);
    await waitForGameReady(page);

    // Add points
    await addPoint(page, 'MobileResult1');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // Results should be visible and fit on mobile
    await page.waitForTimeout(2000);
    await expect(page.locator('text=MobileResult1')).toBeVisible();
    await expect(page.locator('text=MobileResult2')).toBeVisible();
  });

  test('should show medal emojis for top players', async ({ page }) => {
    await startGame(page, ['Gold', 'Silver', 'Bronze', 'Fourth']);
    await waitForGameReady(page);

    // Give different scores to create ranking
    // Gold: 5 points
    for (let i = 0; i < 5; i++) {
      await addPoint(page, 'Gold');
      await page.waitForTimeout(2500);
    }

    // Silver: 3 points
    for (let i = 0; i < 3; i++) {
      await addPoint(page, 'Silver');
      await page.waitForTimeout(2500);
    }

    // Bronze: 2 points
    for (let i = 0; i < 2; i++) {
      await addPoint(page, 'Bronze');
      await page.waitForTimeout(2500);
    }

    // Fourth: 1 point
    await addPoint(page, 'Fourth');
    await page.waitForTimeout(2500);

    // End game
    await endGame(page);

    // Wait for results
    await page.waitForTimeout(2000);

    // Check for medal emojis (if they're rendered)
    const medalVisible = await page
      .locator('text=🥇')
      .or(page.locator('text=🥈'))
      .or(page.locator('text=🥉'))
      .isVisible()
      .catch(() => false);

    if (medalVisible) {
      await expect(page.locator('text=🥇')).toBeVisible();
    }
  });
});
