#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APPS_DIR="$ROOT_DIR/apps"
APK_NAME="mda-2.2.0-25.apk"
APK_PATH="$APPS_DIR/$APK_NAME"
URL="https://github.com/saucelabs/my-demo-app-android/releases/download/2.2.0/${APK_NAME}"

mkdir -p "$APPS_DIR"

if [[ -f "$APK_PATH" ]]; then
  echo "APK already present: $APK_PATH"
  ls -lh "$APK_PATH"
  exit 0
fi

echo "Downloading Sauce Labs My Demo App (dummy Android APK)..."
echo "  $URL"
curl -L --fail --retry 3 -o "$APK_PATH" "$URL"
ls -lh "$APK_PATH"
echo "Done. Package: com.saucelabs.mydemoapp.android"
