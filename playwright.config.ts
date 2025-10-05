import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Žluté Auto E2E Testing
 *
 * Tests are designed to work with Firebase Firestore in test mode.
 * Make sure your Firebase emulator is running or you have a test project configured.
 */
export default defineConfig({
  testDir: './e2e',

  // Maximum time one test can run (increased for Firebase operations)
  timeout: 120 * 1000,

  // Test execution settings
  fullyParallel: false, // Run tests sequentially to avoid Firebase conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid Firebase race conditions

  // Global timeout for entire test run
  globalTimeout: 30 * 60 * 1000, // 30 minutes

  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Capture screenshots on failure
    screenshot: 'only-on-failure',

    // Capture video on first retry
    video: 'retain-on-failure',

    // Trace on first retry
    trace: 'on-first-retry',

    // Default timeout for actions (increased for Firebase)
    actionTimeout: 30000,

    // Navigation timeout
    navigationTimeout: 60000,
  },

  // Configure projects for different browsers and viewports
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
      },
    },
  ],

  // Web server configuration - auto-start dev server for tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
