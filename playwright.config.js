import { defineConfig } from '@playwright/test';
const browserName = process.env.RF_BROWSER || 'chromium';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName,
    launchOptions: browserName === 'chromium' && process.env.RF_CHROMIUM_PATH ? { executablePath: process.env.RF_CHROMIUM_PATH } : {},
    trace: 'retain-on-failure'
  },
  // Apply real receiver backpressure so native transfer progress and timeout checks are reproducible.
  webServer: { command: 'npm run dev', env: { RF_UPLOAD_DELAY_MS: '50' }, url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI }
});
