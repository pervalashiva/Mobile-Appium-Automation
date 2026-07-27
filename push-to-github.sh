#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_DIR"

OWNER="pervalashiva"
REPO="Mobile-Appium-Automation"
REMOTE_URL="https://github.com/${OWNER}/${REPO}.git"
DESC="Appium + WebdriverIO Android automation framework with My Demo App"

echo "==> Checking GitHub auth..."
if ! gh auth status -h github.com >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated."
  echo "Run: gh auth login -h github.com"
  exit 1
fi

ACTIVE_USER="$(gh api user --jq .login)"
if [[ "$ACTIVE_USER" != "$OWNER" ]]; then
  echo "Expected authenticated user '${OWNER}', got '${ACTIVE_USER}'."
  exit 1
fi

echo "==> Ensuring branch is main..."
git checkout main >/dev/null 2>&1 || git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  echo "==> Remote 'origin' already exists: $(git remote get-url origin)"
else
  echo "==> Creating public repo ${OWNER}/${REPO} (or attaching if it exists)..."
  if gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then
    git remote add origin "$REMOTE_URL"
  else
    gh repo create "${OWNER}/${REPO}" \
      --public \
      --source=. \
      --remote=origin \
      --description "$DESC"
  fi
fi

echo "==> Pushing main to origin..."
git push -u origin main

echo "==> Done: https://github.com/${OWNER}/${REPO}"
