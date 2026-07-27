#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APK="$ROOT_DIR/apps/mda-2.2.0-25.apk"
PACKAGE="com.saucelabs.mydemoapp.android"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

if [[ ! -f "$APK" ]]; then
  echo "APK missing. Running download..."
  bash "$ROOT_DIR/scripts/download-app.sh"
fi

if ! command -v adb >/dev/null 2>&1; then
  echo "ERROR: adb not found. Install Android Studio / platform-tools."
  exit 1
fi

if ! adb devices | grep -qE $'\tdevice$'; then
  echo "ERROR: No Android device/emulator connected."
  echo "Start an emulator with: npm run emu:start"
  adb devices -l
  exit 1
fi

echo "Installing $APK ..."
adb uninstall "$PACKAGE" >/dev/null 2>&1 || true
adb install -r "$APK"
echo "Installed package: $PACKAGE"
adb shell pm list packages | grep "$PACKAGE" || true
