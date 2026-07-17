#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo ""
echo "=========================================="
echo "  AutoHealAI v2 -- Linux/macOS Setup"
echo "=========================================="
echo ""
echo "[1/4] Installing Python dependencies..."
pip install -r requirements.txt
echo "[2/4] Generating synthetic dataset..."
python simulation/data_generator.py
echo "[3/4] Training ML ensemble model..."
python ml_models/train.py
echo "[4/4] Installing frontend dependencies..."
cd frontend && npm install && cd ..
echo ""
echo "Setup complete! Run: ./start.sh"
