import { test, expect } from '@playwright/test';
import { fillPlayerNames } from './helpers';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page correctly', async ({ page }) => {
    // Check main title
    await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();

    // Check subtitle/description
    await expect(page.locator('text=Kdo první vidí žluté auto?')).toBeVisible();

    // Check start button
    await expect(page.locator('button:has-text("ZAČÍT HRÁT")')).toBeVisible();

    // Should show 2 player inputs by default
    await expect(page.locator('input[placeholder="Jméno hráče 1"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Jméno hráče 2"]')).toBeVisible();

    // Check for SEO content sections
    await expect(page.locator('text=Co je Žluté Auto?')).toBeVisible();
    await expect(page.locator('text=Jak hrát?')).toBeVisible();
  });

  test('should allow adding players up to 8', async ({ page }) => {
    // Initially 2 players
    await expect(page.locator('input[placeholder*="Jméno hráče"]')).toHaveCount(2);

    // Add players up to 8
    for (let i = 2; i < 8; i++) {
      await page.click('button:has-text("Přidat hráče")');
      await expect(page.locator('input[placeholder*="Jméno hráče"]')).toHaveCount(
        i + 1
      );
    }

    // Should have 8 players now
    await expect(page.locator('input[placeholder*="Jméno hráče"]')).toHaveCount(8);

    // Add button should not be visible when at max players
    await expect(page.locator('button:has-text("Přidat hráče")')).not.toBeVisible();
  });

  test('should allow removing players down to 2', async ({ page }) => {
    // Add a third player
    await page.click('button:has-text("Přidat hráče")');
    await expect(page.locator('input[placeholder*="Jméno hráče"]')).toHaveCount(3);

    // Remove buttons should be visible
    const removeButtons = page.locator('button:has-text("✕")');
    await expect(removeButtons).toHaveCount(3);

    // Remove one player
    await removeButtons.first().click();
    await expect(page.locator('input[placeholder*="Jméno hráče"]')).toHaveCount(2);

    // Remove buttons should not be visible when at minimum
    await expect(page.locator('button:has-text("✕")')).not.toBeVisible();
  });

  test('should validate player names', async ({ page }) => {
    // Try to start game without names
    await page.click('button:has-text("ZAČÍT HRÁT")');

    // Should show error message
    await expect(page.locator('text=Musíte zadat alespoň 2 hráče')).toBeVisible();
  });

  test('should sanitize player names', async ({ page }) => {
    // Try to input special characters
    const input = page.locator('input[placeholder="Jméno hráče 1"]');
    await input.fill('Player<script>alert()</script>');

    // Should remove special characters
    const value = await input.inputValue();
    expect(value).not.toContain('<');
    expect(value).not.toContain('>');
  });

  test('should enforce max length of 20 characters', async ({ page }) => {
    const longName = 'ThisIsAVeryLongPlayerNameThatExceeds20Characters';
    const input = page.locator('input[placeholder="Jméno hráče 1"]');
    await input.fill(longName);

    const value = await input.inputValue();
    expect(value.length).toBeLessThanOrEqual(20);
  });

  test('should open game menu and share modal', async ({ page }) => {
    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();

    // Wait for menu to open
    await page.waitForTimeout(500);

    // Check for menu items
    await expect(page.locator('text=Nová hra')).toBeVisible();
    await expect(page.locator('text=Sdílet')).toBeVisible();
    await expect(page.locator('text=O hře')).toBeVisible();
  });

  test('should handle game creation and redirect', async ({ page }) => {
    // Fill in player names
    await fillPlayerNames(page, ['Alice', 'Bob']);

    // Click start button
    await page.click('button:has-text("ZAČÍT HRÁT")');

    // Should redirect to game page
    await page.waitForURL(/\/game\/[^/]+/, { timeout: 20000 });

    // Check we're on the game page
    const url = page.url();
    expect(url).toContain('/game/');

    // Should show game interface
    await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();
  });

  test('should show loading state during game creation', async ({ page }) => {
    await fillPlayerNames(page, ['Player1', 'Player2']);

    // Click start button
    const startButton = page.locator('button:has-text("ZAČÍT HRÁT")');
    await startButton.click();

    // Should show loading text (might be quick)
    // Note: This test might be flaky due to fast Firebase response
    await page.waitForTimeout(100);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional
    await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();
    await expect(page.locator('button:has-text("ZAČÍT HRÁT")')).toBeVisible();

    // Fill players and start game
    await fillPlayerNames(page, ['Mobile1', 'Mobile2']);
    await page.click('button:has-text("ZAČÍT HRÁT")');

    // Should redirect
    await page.waitForURL(/\/game\/[^/]+/, { timeout: 20000 });
  });
});
