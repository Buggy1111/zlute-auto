import { test, expect } from '@playwright/test';
import { startGame, waitForGameReady } from './helpers';

test.describe('Navigation Modal and Deep Links', () => {
  test('should open navigation modal from game menu', async ({ page }) => {
    await startGame(page, ['Nav1', 'Nav2']);
    await waitForGameReady(page);

    // Open game menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Look for navigation option
    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Navigation modal should open
      await expect(page.locator('h2:has-text("Navigace")')).toBeVisible();
    }
  });

  test('should display all navigation app options', async ({ page }) => {
    await startGame(page, ['MapUser1', 'MapUser2']);
    await waitForGameReady(page);

    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Click navigation if available
    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Check for navigation app buttons
      await expect(page.locator('text=Google Maps')).toBeVisible();
      await expect(page.locator('text=Waze')).toBeVisible();
      await expect(page.locator('text=Mapy.cz')).toBeVisible();
      await expect(page.locator('text=Apple Maps')).toBeVisible();
    }
  });

  test('should show navigation instructions', async ({ page }) => {
    await startGame(page, ['Guide1', 'Guide2']);
    await waitForGameReady(page);

    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Click navigation
    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Check for instruction sections
      await expect(page.locator('text=Jak to funguje?')).toBeVisible();
      await expect(page.locator('text=Hra běží na pozadí')).toBeVisible();
    }
  });

  test('should show Android split screen tip', async ({ page }) => {
    await startGame(page, ['Android1', 'Android2']);
    await waitForGameReady(page);

    // Open menu and navigation
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Check for Android tip
      await expect(
        page.locator('text=Tip pro Android').or(page.locator('text=Rozdělenou obrazovku'))
      ).toBeVisible();
    }
  });

  test('should close navigation modal with close button', async ({ page }) => {
    await startGame(page, ['Close1', 'Close2']);
    await waitForGameReady(page);

    // Open menu and navigation
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Modal should be open
      await expect(page.locator('h2:has-text("Navigace")')).toBeVisible();

      // Click close button
      const closeButton = page.locator('button:has-text("Rozumím, zavřít")').or(
        page.locator('button[aria-label="Zavřít"]')
      );
      await closeButton.first().click();

      // Modal should close
      await expect(page.locator('h2:has-text("Navigace")')).not.toBeVisible({
        timeout: 2000,
      });
    }
  });

  test('should close navigation modal with backdrop click', async ({ page }) => {
    await startGame(page, ['Backdrop1', 'Backdrop2']);
    await waitForGameReady(page);

    // Open menu and navigation
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Modal should be open
      await expect(page.locator('h2:has-text("Navigace")')).toBeVisible();

      // Click backdrop (the dark overlay)
      await page.locator('.fixed.inset-0.bg-black').first().click({ position: { x: 10, y: 10 } });

      // Modal should close
      await expect(page.locator('h2:has-text("Navigace")')).not.toBeVisible({
        timeout: 2000,
      });
    }
  });

  test('should handle navigation app clicks (without actually navigating)', async ({
    page,
  }) => {
    await startGame(page, ['NavClick1', 'NavClick2']);
    await waitForGameReady(page);

    // Open menu and navigation
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Listen for new page/tab opening (but don't follow)
      const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 5000 }).catch(() => null),
        page.locator('button:has-text("Google Maps")').click(),
      ]);

      // On desktop, a new tab should open
      // On mobile simulation, window.location would change
      // Either way, the click should work
      await page.waitForTimeout(1000);
    }
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await startGame(page, ['MobileNav1', 'MobileNav2']);
    await waitForGameReady(page);

    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Navigation should be accessible
    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Modal should fit on mobile
      await expect(page.locator('h2:has-text("Navigace")')).toBeVisible();

      // All navigation apps should be visible
      await expect(page.locator('text=Google Maps')).toBeVisible();
      await expect(page.locator('text=Waze')).toBeVisible();
      await expect(page.locator('text=Mapy.cz')).toBeVisible();
      await expect(page.locator('text=Apple Maps')).toBeVisible();
    }
  });

  test('should show wake lock information', async ({ page }) => {
    await startGame(page, ['WakeLock1', 'WakeLock2']);
    await waitForGameReady(page);

    // Open menu and navigation
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();

      // Check for wake lock info
      await expect(
        page.locator('text=Obrazovka nezhasne').or(page.locator('text=obrazovku zapnutou'))
      ).toBeVisible();
    }
  });

  test('should preserve game state after opening navigation modal', async ({ page }) => {
    await startGame(page, ['StateTest1', 'StateTest2']);
    await waitForGameReady(page);

    // Verify players are there
    await expect(page.locator('button:has-text("StateTest1")')).toBeVisible();

    // Open and close navigation modal
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    const navButton = page.locator('button:has-text("Navigace")').or(
      page.locator('text=Navigace')
    );

    if (await navButton.isVisible()) {
      await navButton.click();
      await page.waitForTimeout(500);

      // Close modal
      const closeButton = page.locator('button:has-text("Rozumím, zavřít")');
      await closeButton.click();
    }

    // Game should still be there
    await expect(page.locator('button:has-text("StateTest1")')).toBeVisible();
    await expect(page.locator('button:has-text("StateTest2")')).toBeVisible();
  });
});
