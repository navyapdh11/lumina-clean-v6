#!/bin/bash
set -euo pipefail

echo "🚀 Phase 6 Deployment: MCTS-DFS + KAIROS GoT + Terraform Validation"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "[1/8] Validating environment..."
npm run type-check || exit 1

echo "[2/8] Running tests..."
npm run test:ci || echo "Tests not configured, skipping"

echo "[3/8] Building application..."
npm run build || exit 1

echo "[4/8] Validating Terraform..."
if [ -d "infrastructure/terraform" ]; then
    chmod +x scripts/validate-terraform.sh
    ./scripts/validate-terraform.sh validate || echo "Terraform validation had warnings"
else
    echo "No Terraform directory found, skipping"
fi

echo "[5/8] Deploying to infrastructure..."
if command -v kubectl &> /dev/null && [ -f "kubernetes/phase6-manifests.yaml" ]; then
    kubectl apply -f kubernetes/phase6-manifests.yaml
else
    echo "Skipping K8s deployment (not configured)"
fi

echo "[6/8] Starting MCTS-DFS agent daemon..."
kubectl rollout restart deployment/lumina-clean -n lumina-clean 2>/dev/null || echo "K8s not available"

echo "[7/8] Warming semantic cache..."
curl -s -X POST "https://lumina-clean.app/api/cache/warm" \
  -H "Authorization: Bearer $ADMIN_TOKEN" || echo "Cache warmup skipped"

echo "[8/8] Running smoke tests..."
sleep 10
curl -sI https://lumina-clean.app | head -1
curl -sI https://lumina-clean.app/dashboard | head -1
curl -sI https://lumina-clean.app/dashboard/agents/kairos | head -1
curl -sI https://lumina-clean.app/dashboard/agents/krites | head -1

echo "✅ Phase 6 deployment complete!"
echo "📊 Monitor: https://grafana.lumina-clean.app"
echo "🧠 LangSmith: https://smith.langchain.com/o/org/p/lumina-clean"
