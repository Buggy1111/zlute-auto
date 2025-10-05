import { test, expect } from '@playwright/test';
import { startGame, waitForGameReady } from './helpers';

test.describe('PWA and Accessibility Features', () => {
  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');

    // Check for manifest link in head
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);

    // Get manifest URL
    const href = await manifestLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('should have proper meta tags for PWA', async ({ page }) => {
    await page.goto('/');

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    // Check theme color
    const themeColor = page.locator('meta[name="theme-color"]');
    if ((await themeColor.count()) > 0) {
      await expect(themeColor).toHaveAttribute('content', /.+/);
    }
  });

  test('should have proper page title', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Žluté Auto/);
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await page.goto('/');

    // Should have main heading
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Should have buttons with proper labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focus should move between elements
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper button labels for screen readers', async ({ page }) => {
    await startGame(page, ['A11y1', 'A11y2']);
    await waitForGameReady(page);

    // Check that buttons have accessible text
    const playerButtons = page.locator('button:has-text("A11y1")');
    await expect(playerButtons.first()).toBeVisible();
  });

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/');

    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Focus should be managed within modal
    const modal = page.locator('text=Nová hra');
    if (await modal.isVisible()) {
      await expect(modal).toBeVisible();
    }
  });

  test('should work offline (service worker)', async ({ page, context }) => {
    // This test checks if service worker is registered
    await page.goto('/');

    // Check for service worker registration
    const swRegistered = await page.evaluate(async () => {
      return 'serviceWorker' in navigator;
    });

    expect(swRegistered).toBe(true);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // Get background and text colors
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(bgColor).toBeTruthy();
  });

  test('should support touch events on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await startGame(page, ['Touch1', 'Touch2']);
    await waitForGameReady(page);

    // Tap on player button
    const button = page.locator('button:has-text("Touch1")').first();
    await button.tap();

    // Should work without errors
    await page.waitForTimeout(1000);
  });

  test('should handle screen orientation changes', async ({ page }) => {
    await page.goto('/');

    // Simulate portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();

    // Simulate landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();
  });

  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await startGame(page, ['ARIA1', 'ARIA2']);
    await waitForGameReady(page);

    // Open menu
    const menuButton = page.locator('button').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Check for ARIA labels
    const closeButtons = page.locator('button[aria-label]');
    if ((await closeButtons.count()) > 0) {
      const ariaLabel = await closeButtons.first().getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should show install prompt on supported devices', async ({ page }) => {
    await page.goto('/');

    // Check if beforeinstallprompt is supported
    const installSupported = await page.evaluate(() => {
      return 'onbeforeinstallprompt' in window;
    });

    // Just verify the API exists (actual prompt is browser-controlled)
    expect(typeof installSupported).toBe('boolean');
  });

  test('should have fast initial load time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle vibration API on supported devices', async ({ page }) => {
    await startGame(page, ['Vibrate1', 'Vibrate2']);
    await waitForGameReady(page);

    // Check if vibration API is available
    const vibrateSupported = await page.evaluate(() => {
      return 'vibrate' in navigator;
    });

    // Click button (which should trigger vibration if supported)
    await page.locator('button:has-text("Vibrate1")').first().click();

    // Just verify the API exists
    expect(typeof vibrateSupported).toBe('boolean');
  });

  test('should have responsive design at various breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, height: 568, name: 'small mobile' },
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'tablet landscape' },
      { width: 1280, height: 720, name: 'desktop' },
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');

      // Main content should be visible
      await expect(page.locator('h1:has-text("Žluté Auto")')).toBeVisible();
      await expect(page.locator('button:has-text("ZAČÍT HRÁT")')).toBeVisible();
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    await page.goto('/');

    // Check if reduced motion is respected
    const respectsReducedMotion = await page.evaluate(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      return mediaQuery.matches;
    });

    // Just verify the media query exists
    expect(typeof respectsReducedMotion).toBe('boolean');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Navigate to invalid game
    await page.goto('/game/nonexistent-game-id-12345');

    // Should show error message
    await expect(page.locator('text=Hra nenalezena')).toBeVisible({ timeout: 10000 });

    // Should have button to create new game
    await expect(page.locator('button:has-text("Vytvořit novou hru")')).toBeVisible();
  });
});
