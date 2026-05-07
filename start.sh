#!/bin/bash

echo ""
echo " ========================================"
echo "  AI Insurance Content Generator"
echo "  Powered by Claude AI + ChatGPT Image 2"
echo " ========================================"
echo ""

if ! command -v node &>/dev/null; then
  echo " [ERROR] Node.js is not installed."
  echo " Please download it from https://nodejs.org"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo " Installing dependencies, please wait..."
  npm install
  echo ""
fi

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo " Open .env.local and add your ANTHROPIC_API_KEY, then run again."
  exit 0
fi

echo " Starting app at http://localhost:3500"
echo " Press Ctrl+C to stop."
echo ""

(sleep 5 && (open http://localhost:3500 2>/dev/null || xdg-open http://localhost:3500 2>/dev/null)) &

npx next dev -p 3500
