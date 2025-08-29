#!/bin/bash

# Pre-submission validation script
# Usage: ./scripts/validate-changes.sh

set -e

echo "🔍 Validating changes before submission..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS_COUNT=0
FAIL_COUNT=0

# Function to print status
print_status() {
    local status=$1
    local message=$2
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $message"
        ((PASS_COUNT++))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $message"
        ((FAIL_COUNT++))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC}: $message"
    else
        echo "ℹ️  $message"
    fi
}

echo ""
echo "🔍 Running validation checks..."
echo ""

# Check 1: Build validation
echo "Building project..."
if npm run build > /dev/null 2>&1; then
    print_status "PASS" "Project builds successfully"
else
    print_status "FAIL" "Project build failed - run 'npm run build' to see errors"
fi

# Check 2: Git status
uncommitted_files=$(git status --porcelain | wc -l)
if [ "$uncommitted_files" -eq 0 ]; then
    print_status "PASS" "Working directory is clean"
else
    print_status "WARN" "You have $uncommitted_files uncommitted changes"
    echo "   Run 'git status' to see uncommitted files"
fi

# Check 3: Current branch check
current_branch=$(git branch --show-current)
if [ "$current_branch" = "main" ]; then
    print_status "WARN" "You're on main branch - consider creating a feature branch"
else
    print_status "PASS" "Working on feature branch: $current_branch"
fi

# Check 4: Environment file validation
if [ -f ".env.local" ]; then
    if grep -q "your-project-id\|your-firebase\|placeholder" .env.local; then
        print_status "WARN" ".env.local contains placeholder values"
    else
        print_status "PASS" "Environment file appears configured"
    fi
else
    print_status "WARN" ".env.local file not found - may be needed for local development"
fi

# Check 5: Package vulnerabilities
echo ""
echo "Checking for security vulnerabilities..."
if npm audit --audit-level moderate > /dev/null 2>&1; then
    print_status "PASS" "No security vulnerabilities found"
else
    print_status "WARN" "Security vulnerabilities detected - run 'npm audit' for details"
fi

# Check 6: Branch naming convention
if [[ "$current_branch" =~ ^(feature|fix|docs|refactor)/.+ ]]; then
    print_status "PASS" "Branch follows naming convention"
elif [ "$current_branch" = "main" ]; then
    # Already warned above
    :
else
    print_status "WARN" "Branch name doesn't follow convention (feature/, fix/, docs/, refactor/)"
fi

# Check 7: Recent commits
commit_count=$(git rev-list --count HEAD ^origin/main 2>/dev/null || echo "0")
if [ "$commit_count" -gt 0 ]; then
    print_status "PASS" "Branch has $commit_count commits ahead of main"
    
    # Show recent commit messages
    echo ""
    echo "📝 Recent commits:"
    git log --oneline --max-count=5 origin/main..HEAD 2>/dev/null || git log --oneline --max-count=5
else
    print_status "WARN" "No commits ahead of main"
fi

echo ""
echo "📊 Validation Summary:"
echo "   ✅ Passed: $PASS_COUNT"
echo "   ❌ Failed: $FAIL_COUNT"

if [ $FAIL_COUNT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All critical checks passed!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Commit any remaining changes: git add . && git commit -m 'Your message'"
    echo "   2. Push your branch: git push origin $current_branch"
    echo "   3. Open PR on GitHub"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some critical checks failed!${NC}"
    echo "Please fix the issues above before submitting your PR."
    echo ""
    exit 1
fi