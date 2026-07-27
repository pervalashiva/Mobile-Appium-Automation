import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import allureReporter from '@wdio/allure-reporter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apkPath = path.join(__dirname, 'apps', 'mda-2.2.0-25.apk');
const deviceName = process.env.DEVICE_NAME || 'Android Emulator';
const platformVersion = process.env.PLATFORM_VERSION || '';
const udid = process.env.UDID || '';
const appiumPort = Number(process.env.APPIUM_PORT || 4723);

if (!fs.existsSync(apkPath)) {
  console.warn(
    `[wdio] APK not found at ${apkPath}. Run: npm run download:app`
  );
}

export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.js'],
  exclude: [],
  maxInstances: 1,
  port: appiumPort,
  path: '/',
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': deviceName,
      ...(platformVersion ? { 'appium:platformVersion': platformVersion } : {}),
      ...(udid ? { 'appium:udid': udid } : {}),
      'appium:app': apkPath,
      'appium:appPackage': 'com.saucelabs.mydemoapp.android',
      'appium:appActivity': '.view.activities.SplashActivity',
      'appium:autoGrantPermissions': true,
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
      'appium:adbExecTimeout': 120000,
    },
  ],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 20000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 2,
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: '127.0.0.1',
          port: appiumPort,
          relaxedSecurity: true,
        },
      },
    ],
  ],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },
  afterTest: async function (_test, _context, { error }) {
    if (!error) return;
    const shotsDir = path.join(__dirname, 'test-results');
    if (!fs.existsSync(shotsDir)) fs.mkdirSync(shotsDir, { recursive: true });
    const file = path.join(shotsDir, `${Date.now()}-failed.png`);
    await driver.saveScreenshot(file);
    allureReporter.addAttachment(
      'Screenshot on failure',
      fs.readFileSync(file),
      'image/png'
    );
  },
};
