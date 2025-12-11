#!/bin/sh
set -e

BACKEND_URL="http://backend:8080/health"

echo "⏳ Waiting for backend at $BACKEND_URL..."
until curl -s -f "$BACKEND_URL" > /dev/null; do
  echo "Waiting for backend..."
  sleep 2
done

echo "✅ Backend is ready! Serving frontend (production)..."
# Serve the built files in dist/ using a simple server
npx serve -s dist -l 3000
