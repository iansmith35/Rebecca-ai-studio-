#!/bin/bash

# cleanup-branch.sh
# Helper script for cleaning up branches after PR merge

set -e  # Exit on any error

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Rebecca AI Studio - Branch Cleanup${NC}"
echo "===================================="
echo ""

# Check if branch name is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide the branch name to cleanup${NC}"
    echo ""
    echo "Usage: ./cleanup-branch.sh <branch-name>"
    echo ""
    echo "Examples:"
    echo "  ./cleanup-branch.sh feature/add-user-auth"
    echo "  ./cleanup-branch.sh bugfix/fix-email-validation"
    echo ""
    echo -e "${BLUE}💡 Available local branches:${NC}"
    git branch --format='%(refname:short)' | grep -v '^main$' | sed 's/^/  /'
    echo ""
    exit 1
fi

BRANCH_NAME="$1"

echo -e "${BLUE}Cleaning up branch: ${BRANCH_NAME}${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if branch exists locally
if ! git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
    echo -e "${YELLOW}⚠️  Warning: Branch '${BRANCH_NAME}' does not exist locally${NC}"
    LOCAL_BRANCH_EXISTS=false
else
    LOCAL_BRANCH_EXISTS=true
fi

# Check if branch exists on remote
if git ls-remote --heads origin "${BRANCH_NAME}" | grep -q "${BRANCH_NAME}"; then
    REMOTE_BRANCH_EXISTS=true
else
    echo -e "${YELLOW}⚠️  Warning: Branch '${BRANCH_NAME}' does not exist on remote${NC}"
    REMOTE_BRANCH_EXISTS=false
fi

# If neither exists, exit
if [ "$LOCAL_BRANCH_EXISTS" = false ] && [ "$REMOTE_BRANCH_EXISTS" = false ]; then
    echo -e "${RED}❌ Error: Branch '${BRANCH_NAME}' does not exist locally or remotely${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Don't allow cleanup of main branch
if [ "$BRANCH_NAME" = "main" ]; then
    echo -e "${RED}❌ Error: Cannot cleanup the main branch${NC}"
    exit 1
fi

# Switch to main if currently on the branch being cleaned up
if [ "$CURRENT_BRANCH" = "$BRANCH_NAME" ]; then
    echo -e "${YELLOW}⚠️  Currently on branch being cleaned up. Switching to main...${NC}"
    git checkout main
    CURRENT_BRANCH="main"
fi

# Pull latest changes from main
echo -e "${BLUE}📡 Pulling latest changes from origin/main...${NC}"
if ! git pull origin main; then
    echo -e "${YELLOW}⚠️  Warning: Failed to pull from origin/main${NC}"
    echo "Continuing with cleanup anyway..."
fi

# Check if the branch has been merged
if [ "$LOCAL_BRANCH_EXISTS" = true ]; then
    if git merge-base --is-ancestor "${BRANCH_NAME}" main; then
        echo -e "${GREEN}✅ Branch '${BRANCH_NAME}' has been merged into main${NC}"
        BRANCH_MERGED=true
    else
        echo -e "${YELLOW}⚠️  Warning: Branch '${BRANCH_NAME}' may not be fully merged into main${NC}"
        BRANCH_MERGED=false
        
        # Ask for confirmation
        read -p "Are you sure you want to delete this unmerged branch? (y/N): " confirm
        if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
            echo -e "${BLUE}ℹ️  Cleanup cancelled${NC}"
            exit 0
        fi
    fi
else
    BRANCH_MERGED=true  # Assume merged if only remote exists
fi

echo ""
echo -e "${BLUE}🧹 Starting cleanup process...${NC}"

# Delete local branch
if [ "$LOCAL_BRANCH_EXISTS" = true ]; then
    echo -e "${BLUE}Deleting local branch: ${BRANCH_NAME}${NC}"
    if [ "$BRANCH_MERGED" = true ]; then
        git branch -d "${BRANCH_NAME}"
    else
        git branch -D "${BRANCH_NAME}"  # Force delete unmerged branch
    fi
    echo -e "${GREEN}✅ Local branch deleted${NC}"
fi

# Delete remote branch
if [ "$REMOTE_BRANCH_EXISTS" = true ]; then
    echo -e "${BLUE}Deleting remote branch: origin/${BRANCH_NAME}${NC}"
    if git push origin --delete "${BRANCH_NAME}"; then
        echo -e "${GREEN}✅ Remote branch deleted${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Failed to delete remote branch${NC}"
        echo "You may need to delete it manually on GitHub"
    fi
fi

# Clean up remote tracking references
echo -e "${BLUE}Cleaning up remote tracking references...${NC}"
git remote prune origin

echo ""
echo -e "${GREEN}✅ Branch cleanup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "• Current branch: $(git branch --show-current)"
if [ "$LOCAL_BRANCH_EXISTS" = true ]; then
    echo "• Local branch '${BRANCH_NAME}': DELETED"
fi
if [ "$REMOTE_BRANCH_EXISTS" = true ]; then
    echo "• Remote branch 'origin/${BRANCH_NAME}': DELETED"
fi
echo "• Main branch: UP TO DATE"
echo ""
echo -e "${BLUE}🚀 Ready for your next feature!${NC}"
echo "Create a new branch with: ./create-feature-branch.sh \"your-next-feature\""
echo ""