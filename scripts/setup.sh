#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Mobile Appium Automation setup"
echo

# Node
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is required. Install via nvm (Node 18+)."
  exit 1
fi
echo "Node: $(node -v)"

# Java
if ! command -v java >/dev/null 2>&1; then
  echo "ERROR: Java is required for Appium UiAutomator2."
  exit 1
fi
echo "Java: $(java -version 2>&1 | head -1)"

# Android SDK / adb
ADB_BIN=""
if command -v adb >/dev/null 2>&1; then
  ADB_BIN="$(command -v adb)"
elif [[ -x "$HOME/Library/Android/sdk/platform-tools/adb" ]]; then
  ADB_BIN="$HOME/Library/Android/sdk/platform-tools/adb"
  export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
  export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
fi

if [[ -z "$ADB_BIN" ]]; then
  echo
  echo "WARNING: Android SDK / adb not found."
  echo "Install Android Studio, then open it once to install the SDK:"
  echo "  https://developer.android.com/studio"
  echo
  echo "After install, add to ~/.zshrc:"
  echo '  export ANDROID_HOME="$HOME/Library/Android/sdk"'
  echo '  export ANDROID_SDK_ROOT="$ANDROID_HOME"'
  echo '  export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"'
  echo
else
  echo "adb: $ADB_BIN"
fi

echo
echo "==> npm install"
npm install

echo
echo "==> Ensure Appium UiAutomator2 driver"
npx appium driver install uiautomator2 || npx appium driver update uiautomator2 || true
npx appium driver list --installed || true

echo
echo "==> Download dummy APK"
bash "$ROOT_DIR/scripts/download-app.sh"

echo
echo "Setup complete."
echo
echo "Next steps:"
echo "  1. Install/open Android Studio and create an AVD (Virtual Device)"
echo "  2. Start emulator:  npm run emu:start"
echo "  3. Install APK:     npm run install:apk"
echo "  4. Run tests:       npm test"
