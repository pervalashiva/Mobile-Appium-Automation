# Mobile Appium Automation

Appium + WebdriverIO (JavaScript) framework for **Android** mobile UI automation, using Sauce Labs [My Demo App](https://github.com/saucelabs/my-demo-app-android) as the dummy application.

| Item | Choice |
|------|--------|
| Tool | Appium 2 + WebdriverIO 9 |
| Language | JavaScript (ESM) |
| Framework | Mocha |
| Pattern | Page Object Model |
| Driver | UiAutomator2 |
| Reports | Allure |
| Dummy app | My Demo App Android (`mda-2.2.0-25.apk`) |

---

## Prerequisites

Install these before running tests:

1. **Node.js 18+** ([nvm](https://github.com/nvm-sh/nvm) recommended)
2. **Java 11+** (JDK 17+ preferred for recent Android SDK tools)
3. **Android Studio** — [download](https://developer.android.com/studio)
   - Install **Android SDK**, **Platform-Tools**, and **Emulator**
   - Create a Virtual Device: **Device Manager → Create Device** (e.g. Pixel 6, API 34)

Add SDK tools to `~/.zshrc` (or `~/.bashrc`):

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

Reload the shell:

```bash
source ~/.zshrc
```

Verify:

```bash
adb version
emulator -list-avds
```

---

## Clone & setup (step by step)

### 1. Clone the repository

```bash
git clone https://github.com/pervalashiva/Mobile-Appium-Automation.git
cd Mobile-Appium-Automation
```

### 2. Install dependencies + download dummy APK

```bash
npm run setup
```

This will:

- run `npm install`
- install the Appium **UiAutomator2** driver
- download the dummy APK to `apps/mda-2.2.0-25.apk`

Or do it manually:

```bash
npm install
npx appium driver install uiautomator2
npm run download:app
```

### 3. Start the Android emulator

```bash
npm run emu:start
```

Wait until the emulator is ready, then confirm:

```bash
adb devices
# Expect: emulator-5554   device
```

### 4. Install the dummy app (optional)

Tests also install the APK via Appium capabilities, but you can install it manually first:

```bash
npm run install:apk
```

### 5. Run the tests

```bash
npm test
```

Appium server starts automatically via `@wdio/appium-service`.

---

## Run individual suites

```bash
npm run test:login
npm run test:catalog
npm run test:cart
```

### Optional environment overrides

```bash
DEVICE_NAME="Pixel_6_API_34" PLATFORM_VERSION=14 UDID=emulator-5554 npm test
```

---

## Allure reports

```bash
npm run allure:generate
npm run allure:open
# or
npm run allure:report
```

---

## Test coverage

| Spec | Coverage |
|------|----------|
| `login.spec.js` | Valid login, locked user, empty username validation |
| `catalog.spec.js` | Products list, open product detail |
| `cart.spec.js` | Add to cart, remove from cart |

### Demo credentials (built into My Demo App)

| User | Username | Password |
|------|----------|----------|
| Valid | `bob@example.com` | `10203040` |
| Locked | `alice@example.com` | `10203040` |

---

## Project structure

```
Mobile-Appium-Automation/
├── wdio.conf.js              # Appium capabilities + Allure
├── package.json
├── apps/                     # Dummy APK (downloaded by script; not committed)
├── scripts/
│   ├── setup.sh              # One-time project setup
│   ├── download-app.sh       # Download My Demo App APK
│   ├── start-emulator.sh     # Start first available AVD
│   ├── install-apk.sh        # adb install APK
│   └── list-emulators.sh
└── test/
    ├── data/users.js         # Users & product names
    ├── pages/                # Page Objects
    └── specs/                # Mocha specs
```

---

## Useful npm scripts

| Script | Purpose |
|--------|---------|
| `npm run setup` | Install deps, Appium driver, download APK |
| `npm run download:app` | Download dummy APK only |
| `npm run emu:start` | Start Android emulator |
| `npm run emu:list` | List AVDs / connected devices |
| `npm run install:apk` | Install APK on connected device |
| `npm test` | Run full suite |
| `npm run appium:doctor` | Check UiAutomator2 setup |
| `npm run allure:report` | Generate and open Allure report |

---

## GitHub Actions (CI)

Mobile tests run on GitHub-hosted Ubuntu with an **Android emulator** (API 30, x86_64).

Workflow: [`.github/workflows/appium.yml`](.github/workflows/appium.yml)

### What CI does

1. Install Node 20 + Java 17  
2. `npm ci` and download the dummy APK  
3. Install Appium UiAutomator2 driver  
4. Start Pixel 6 / API 34 emulator (KVM)  
5. Run WebdriverIO + Appium specs  
6. Upload **Allure report**, results, and failure screenshots as artifacts  

### Trigger CI

- **Push / PR** to `main` — runs the full suite  
- **Actions → Appium Android Tests → Run workflow** — choose `all`, `login`, `catalog`, or `cart`

### Download reports

After a run: **Actions →** select the workflow run → **Artifacts** → download `allure-report-*`.

> Emulator boot in CI is slower than a local Mac emulator (often 5–15 minutes). Prefer device clouds (Sauce Labs / BrowserStack) for production pipelines.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `adb not found` | Install Android Studio SDK; export `ANDROID_HOME` |
| No AVDs | Android Studio → Device Manager → Create Device |
| `"Android Studio" is damaged` | Reinstall from the official DMG (do not extract with 7z) |
| Emulator not in `adb devices` | Wait for boot, or run `npm run emu:start` again |
| Session / timeout errors | Confirm `adb devices` shows `device` (not `offline`) |
| APK missing | `npm run download:app` |
| Driver issues | `npx appium driver install uiautomator2` |
| Doctor check | `npm run appium:doctor` |
| CI emulator fails / no KVM | Re-run the workflow; GitHub Ubuntu runners need nested virtualization |

---

## License

ISC
