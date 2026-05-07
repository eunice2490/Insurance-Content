#!/bin/bash

echo ""
echo " ========================================"
echo "  AI Insurance Content Generator"
echo "  Powered by Claude AI + ChatGPT Image 2"
echo " ========================================"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo " [ERROR] Node.js is not installed."
  echo " Please download it from https://nodejs.org"
  echo ""
  exit 1
fi

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
  echo " Installing dependencies, please wait..."
  echo ""
  npm install
  echo ""
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
  echo " [SETUP] Creating .env.local from example..."
  cp .env.local.example .env.local
  echo ""
  echo " !! ACTION REQUIRED !!"
  echo " Open .env.local and add your ANTHROPIC_API_KEY, then run this script again."
  echo ""
  exit 0
fi

echo " Starting app at http://localhost:3000"
echo " Press Ctrl+C to stop."
echo ""

# Open browser after 4s (Mac & Linux)
(sleep 4 && (open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null)) &

npm run dev
