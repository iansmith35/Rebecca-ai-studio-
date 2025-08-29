#!/bin/bash

# Helper script to start a new feature branch
# Usage: ./scripts/new-feature.sh "feature-description"

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 \"feature-description\""
    echo ""
    echo "Examples:"
    echo "  $0 \"add-user-authentication\""
    echo "  $0 \"fix-navigation-bug\""
    echo "  $0 \"update-readme\""
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME=""

# Determine branch prefix based on keywords
if [[ "$FEATURE_NAME" == *"fix"* ]] || [[ "$FEATURE_NAME" == *"bug"* ]]; then
    BRANCH_NAME="fix/${FEATURE_NAME}"
elif [[ "$FEATURE_NAME" == *"doc"* ]] || [[ "$FEATURE_NAME" == *"readme"* ]]; then
    BRANCH_NAME="docs/${FEATURE_NAME}"
elif [[ "$FEATURE_NAME" == *"refactor"* ]] || [[ "$FEATURE_NAME" == *"improve"* ]]; then
    BRANCH_NAME="refactor/${FEATURE_NAME}"
else
    BRANCH_NAME="feature/${FEATURE_NAME}"
fi

# Clean up the branch name (remove spaces, special chars)
BRANCH_NAME=$(echo "$BRANCH_NAME" | sed 's/[^a-zA-Z0-9/-]/-/g' | sed 's/--*/-/g' | sed 's/-$//')

echo "🚀 Starting new feature workflow..."
echo "📦 Feature: $FEATURE_NAME"
echo "🌿 Branch: $BRANCH_NAME"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if main branch exists
if ! git rev-parse --verify main >/dev/null 2>&1; then
    echo "❌ Error: No 'main' branch found"
    exit 1
fi

# Fetch latest changes
echo "📡 Fetching latest changes..."
git fetch origin

# Switch to main and pull latest
echo "🔄 Switching to main branch..."
git checkout main

echo "⬇️  Pulling latest changes..."
git pull origin main

# Check if branch already exists
if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
    echo "❌ Error: Branch '$BRANCH_NAME' already exists"
    echo "💡 Tip: Use a different feature name or delete the existing branch"
    exit 1
fi

# Create and switch to new branch
echo "🌿 Creating new branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo ""
echo "✅ Successfully created feature branch!"
echo ""
echo "📋 Next steps:"
echo "   1. Make your changes"
echo "   2. Test with: npm run dev"
echo "   3. Build with: npm run build"
echo "   4. Commit: git add . && git commit -m 'Your change description'"
echo "   5. Push: git push origin $BRANCH_NAME"
echo "   6. Open PR on GitHub"
echo ""
echo "🧹 When done, cleanup with: ./scripts/cleanup-branch.sh"