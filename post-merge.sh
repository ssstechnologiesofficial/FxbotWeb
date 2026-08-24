#!/usr/bin/env bash
set -euo pipefail

# Post-merge setup must be safe to rerun and must never prompt for input.
export CI=1

npm ci --ignore-scripts --no-audit --no-fund
npm run build