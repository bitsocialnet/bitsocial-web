import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.ABOUT_TEST_PORT ?? 3107);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
  testDir: "./tests",
  timeout: 60_000,
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    viewport: {
      height: 900,
      width: 1440,
    },
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `PORTLESS=0 BROWSER=none ABOUT_PORT=${port} yarn start:about`,
        reuseExistingServer: true,
        timeout: 60_000,
        url: baseURL,
      },
  workers: 1,
});
