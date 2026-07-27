#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

if ! command -v emulator >/dev/null 2>&1; then
  echo "emulator not found. Install Android Studio and SDK Platform-Tools + Emulator."
  exit 1
fi

echo "Available AVDs:"
emulator -list-avds
echo
echo "Connected devices:"
adb devices -l || true
