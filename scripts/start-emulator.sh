#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

if ! command -v emulator >/dev/null 2>&1; then
  echo "ERROR: Android emulator not found."
  echo "Install Android Studio → SDK Manager → Android SDK Platform-Tools + Emulator."
  exit 1
fi

AVD_NAME="${1:-}"
if [[ -z "$AVD_NAME" ]]; then
  AVD_NAME="$(emulator -list-avds | head -n 1 || true)"
fi

if [[ -z "$AVD_NAME" ]]; then
  echo "ERROR: No AVDs found."
  echo "Create one in Android Studio: Device Manager → Create Device"
  exit 1
fi

if adb devices | grep -qE 'emulator-[0-9]+[[:space:]]+device'; then
  echo "An emulator is already running:"
  adb devices -l
  exit 0
fi

echo "Starting AVD: $AVD_NAME"
nohup emulator -avd "$AVD_NAME" -netdelay none -netspeed full >/tmp/android-emulator.log 2>&1 &
echo "Waiting for device boot..."

adb wait-for-device
BOOT=""
for _ in $(seq 1 90); do
  BOOT="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [[ "$BOOT" == "1" ]]; then
    break
  fi
  sleep 2
done

if [[ "$BOOT" != "1" ]]; then
  echo "WARNING: Emulator may still be booting. Check: adb devices"
  echo "Log: /tmp/android-emulator.log"
  exit 1
fi

echo "Emulator ready."
adb devices -l
