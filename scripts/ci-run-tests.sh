#!/usr/bin/env bash
# Runs inside GitHub Actions android-emulator-runner (emulator already launching/up).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

TEST_CMD="${TEST_CMD:-npm test}"
APK="${ROOT_DIR}/apps/mda-2.2.0-25.apk"
PACKAGE="com.saucelabs.mydemoapp.android"

echo "==> Waiting for adb device..."
adb wait-for-device

echo "==> Waiting for Android boot_completed..."
BOOT=""
for _ in $(seq 1 90); do
  BOOT="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [[ "$BOOT" == "1" ]]; then
    break
  fi
  sleep 2
done

if [[ "$BOOT" != "1" ]]; then
  echo "ERROR: Emulator did not finish booting"
  adb devices -l || true
  adb shell getprop sys.boot_completed || true
  exit 1
fi

# Extra settle time for Package Manager / system UI
sleep 5
adb shell input keyevent 82 >/dev/null 2>&1 || true
adb shell settings put global window_animation_scale 0 || true
adb shell settings put global transition_animation_scale 0 || true
adb shell settings put global animator_duration_scale 0 || true

echo "==> Devices:"
adb devices -l

export CI=true
export DEVICE_NAME="${DEVICE_NAME:-Android Emulator}"
export PLATFORM_VERSION="${PLATFORM_VERSION:-}"
export UDID="$(adb devices | awk '/emulator-/{print $1; exit}')"
echo "UDID=${UDID:-}"

if [[ ! -f "$APK" ]]; then
  echo "ERROR: APK missing at $APK"
  exit 1
fi

echo "==> Pre-installing APK..."
adb uninstall "$PACKAGE" >/dev/null 2>&1 || true
adb install -r "$APK"

echo "==> Running: $TEST_CMD"
set +e
# shellcheck disable=SC2086
eval "$TEST_CMD"
CODE=$?
set -e

if [[ "$CODE" -ne 0 ]]; then
  echo "==> Tests failed (exit $CODE). Dumping diagnostics..."
  mkdir -p test-results
  adb devices -l > test-results/adb-devices.txt 2>&1 || true
  adb shell pm path "$PACKAGE" > test-results/pm-path.txt 2>&1 || true
  adb logcat -d -t 400 > test-results/logcat.txt 2>&1 || true
fi

exit "$CODE"
