#!/bin/bash

# create-feature-branch.sh
# Helper script for creating a new feature branch following the git workflow

set -e  # Exit on any error

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌿 Rebecca AI Studio - Create Feature Branch${NC}"
echo "================================================="
echo ""

# Check if description is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide a branch description${NC}"
    echo ""
    echo "Usage: ./create-feature-branch.sh \"your-feature-description\""
    echo ""
    echo "Examples:"
    echo "  ./create-feature-branch.sh \"add-user-authentication\""
    echo "  ./create-feature-branch.sh \"fix-email-validation\""
    echo "  ./create-feature-branch.sh \"update-deployment-docs\""
    echo ""
    exit 1
fi

BRANCH_DESCRIPTION="$1"

# Validate branch description (no spaces, special chars)
if [[ "$BRANCH_DESCRIPTION" =~ [[:space:]] ]]; then
    echo -e "${YELLOW}⚠️  Warning: Branch description contains spaces. Converting to hyphens...${NC}"
    BRANCH_DESCRIPTION=$(echo "$BRANCH_DESCRIPTION" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
fi

# Remove any remaining special characters except hyphens and underscores
BRANCH_DESCRIPTION=$(echo "$BRANCH_DESCRIPTION" | sed 's/[^a-zA-Z0-9_-]//g')

# Determine branch type prefix
echo "Select branch type:"
echo "1) feature/ (new functionality)"
echo "2) bugfix/ (bug fixes)"
echo "3) docs/ (documentation)"
echo "4) refactor/ (code refactoring)"
echo "5) hotfix/ (urgent fixes)"
echo "6) custom (specify your own prefix)"
echo ""
read -p "Enter choice (1-6): " branch_type_choice

case $branch_type_choice in
    1) BRANCH_PREFIX="feature" ;;
    2) BRANCH_PREFIX="bugfix" ;;
    3) BRANCH_PREFIX="docs" ;;
    4) BRANCH_PREFIX="refactor" ;;
    5) BRANCH_PREFIX="hotfix" ;;
    6) 
        read -p "Enter custom prefix (without /): " BRANCH_PREFIX
        if [ -z "$BRANCH_PREFIX" ]; then
            echo -e "${RED}❌ Custom prefix cannot be empty${NC}"
            exit 1
        fi
        ;;
    *) 
        echo -e "${RED}❌ Invalid choice. Using 'feature' as default.${NC}"
        BRANCH_PREFIX="feature"
        ;;
esac

BRANCH_NAME="${BRANCH_PREFIX}/${BRANCH_DESCRIPTION}"

echo ""
echo -e "${BLUE}Creating branch: ${BRANCH_NAME}${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "Current branch: ${CURRENT_BRANCH}"

# Check if branch already exists
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
    echo -e "${RED}❌ Error: Branch '${BRANCH_NAME}' already exists locally${NC}"
    echo "Consider using a different description or delete the existing branch:"
    echo "  git branch -d ${BRANCH_NAME}"
    exit 1
fi

# Check if branch exists on remote
if git ls-remote --heads origin "${BRANCH_NAME}" | grep -q "${BRANCH_NAME}"; then
    echo -e "${RED}❌ Error: Branch '${BRANCH_NAME}' already exists on remote${NC}"
    echo "Consider using a different description or delete the remote branch:"
    echo "  git push origin --delete ${BRANCH_NAME}"
    exit 1
fi

# Switch to main if not already there
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Switching to main branch...${NC}"
    git checkout main
fi

# Pull latest changes from main
echo -e "${BLUE}📡 Pulling latest changes from origin/main...${NC}"
if ! git pull origin main; then
    echo -e "${RED}❌ Error: Failed to pull from origin/main${NC}"
    echo "Please check your network connection and repository access."
    exit 1
fi

# Create and checkout new branch
echo -e "${BLUE}🌿 Creating new branch: ${BRANCH_NAME}${NC}"
git checkout -b "${BRANCH_NAME}"

echo ""
echo -e "${GREEN}✅ Successfully created and switched to branch: ${BRANCH_NAME}${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Make your changes"
echo "2. Test your changes: npm run lint && npm run build"
echo "3. Stage and commit: git add . && git commit -m \"Your descriptive message\""
echo "4. Push branch: git push origin ${BRANCH_NAME}"
echo "5. Create PR on GitHub"
echo "6. After merge, cleanup: ./cleanup-branch.sh ${BRANCH_NAME}"
echo ""
echo -e "${BLUE}💡 Tip: Use descriptive commit messages in imperative mood${NC}"
echo "   Good: \"Add user authentication with Firebase\""
echo "   Bad:  \"Added stuff\""
echo ""