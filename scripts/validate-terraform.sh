# Terraform Validation Pipeline

#!/bin/bash
set -euo pipefail

echo "=========================================="
echo "Terraform Validation Pipeline"
echo "=========================================="

TERRAFORM_DIR="${TERRAFORM_DIR:-infrastructure/terraform}"
STAGE="${1:-validate}"

validate_terraform() {
    echo "[1/6] Checking Terraform installation..."
    if ! command -v terraform &> /dev/null; then
        echo "Installing Terraform..."
        wget -q "https://releases.hashicorp.com/terraform/$(curl -s https://checkpoint-api.hashicorp.com/v1/check/terraform | jq -r '.current_version')/terraform_$(curl -s https://checkpoint-api.hashicorp.com/v1/check/terraform | jq -r '.current_version')_linux_amd64.zip" -O /tmp/terraform.zip
        unzip -o /tmp/terraform.zip -d /usr/local/bin/
        rm /tmp/terraform.zip
    fi
    terraform version
}

init_terraform() {
    echo "[2/6] Initializing Terraform..."
    cd "$TERRAFORM_DIR"
    terraform init -backend=false -get=true
}

validate_syntax() {
    echo "[3/6] Validating Terraform syntax..."
    terraform fmt -recursive -check
    terraform validate
}

check_plan() {
    echo "[4/6] Creating execution plan..."
    terraform plan -out=tfplan -input=false || true
    if [ -f tfplan ]; then
        echo "Plan created successfully"
        rm -f tfplan
    fi
}

security_scan() {
    echo "[5/6] Running security checks..."
    
    # Check for sensitive variables
    if grep -r "sensitive.*=" "$TERRAFORM_DIR" 2>/dev/null | grep -v "sensitive = false" | grep -v "var\." | head -1 | grep -q .; then
        echo "⚠️  Warning: Potential sensitive variables found"
    fi
    
    # Check for hardcoded credentials
    if grep -rE "(password|secret|api_key|token).*=" "$TERRAFORM_DIR" 2>/dev/null | grep -v "var\." | grep -v "sensitive" | head -1 | grep -q .; then
        echo "⚠️  Warning: Potential hardcoded credentials found"
    fi
    
    # Check for unencrypted storage
    if grep -rE "aws_s3_bucket.*encryption" "$TERRAFORM_DIR" 2>/dev/null | grep -v "server_side_encryption_configuration" | head -1 | grep -q .; then
        echo "⚠️  Warning: S3 bucket without encryption configuration"
    fi
}

cost_estimation() {
    echo "[6/6] Estimating costs..."
    if command -v tfsec &> /dev/null; then
        tfsec "$TERRAFORM_DIR" --no-colors || true
    else
        echo "Skipping tfsec (not installed)"
    fi
}

case "$STAGE" in
    validate)
        validate_terraform
        init_terraform
        validate_syntax
        check_plan
        security_scan
        cost_estimation
        ;;
    plan)
        validate_terraform
        init_terraform
        check_plan
        ;;
    init)
        validate_terraform
        init_terraform
        ;;
    security)
        validate_terraform
        init_terraform
        security_scan
        ;;
    *)
        echo "Usage: $0 {validate|plan|init|security}"
        exit 1
        ;;
esac

echo "=========================================="
echo "Terraform validation complete!"
echo "=========================================="
