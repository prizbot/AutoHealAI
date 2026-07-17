#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
pkill -f "uvicorn backend.main" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
echo "Starting backend on http://localhost:8000 ..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
sleep 3
echo "Starting frontend on http://localhost:3000 ..."
cd frontend && npm run dev &
echo ""
echo "  Backend  → http://localhost:8000"
echo "  API Docs → http://localhost:8000/docs"
echo "  Dashboard→ http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop."
trap "kill %1 %2 2>/dev/null" EXIT
wait
