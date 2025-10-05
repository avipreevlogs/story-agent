#!/bin/bash
set -e
echo "Running setup.sh — installing system packages and npm deps"

if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y ffmpeg imagemagick espeak
else
  echo "apt-get not found. On Windows use WSL/Git Bash or install ffmpeg, ImageMagick and espeak manually."
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Please install Node.js 18+ and re-run this script."
  exit 1
fi

echo "Installing node modules..."
npm ci

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "Creating .env from .env.example (please edit with real secrets)..."
    cp .env.example .env
  fi
fi

echo "Setup complete. Edit .env with your keys (or export env vars) before running scripts."
