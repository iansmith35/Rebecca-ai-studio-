#!/bin/bash

# validate-workflow.sh
# Script to validate git workflow compliance and branch management

set -e

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Git Workflow Validation${NC}"
echo "=========================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}Current branch:${NC} ${CURRENT_BRANCH}"

# Validation results
VALIDATION_PASSED=true

echo ""
echo -e "${BLUE}🔍 Workflow Compliance Checks${NC}"
echo "=============================="

# Check 1: Branch naming convention
echo ""
echo "1. Branch Naming Convention"
echo "   -------------------------"

if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo -e "   ${GREEN}✅ On main branch${NC}"
elif [[ "$CURRENT_BRANCH" =~ ^(feature|bugfix|hotfix|docs|refactor)/.+ ]]; then
    echo -e "   ${GREEN}✅ Branch follows naming convention: ${CURRENT_BRANCH}${NC}"
else
    echo -e "   ${YELLOW}⚠️  Branch may not follow naming convention: ${CURRENT_BRANCH}${NC}"
    echo "   Expected format: feature/description, bugfix/description, etc."
fi

# Check 2: Working directory status
echo ""
echo "2. Working Directory Status"
echo "   -------------------------"

if git diff-index --quiet HEAD --; then
    echo -e "   ${GREEN}✅ Working directory is clean${NC}"
else
    echo -e "   ${YELLOW}⚠️  Working directory has uncommitted changes${NC}"
    echo "   Consider committing or stashing changes"
    git status --porcelain | sed 's/^/      /'
fi

# Check 3: Branch is up to date with remote
echo ""
echo "3. Remote Synchronization"
echo "   ---------------------"

if git ls-remote --heads origin "${CURRENT_BRANCH}" | grep -q "${CURRENT_BRANCH}"; then
    # Branch exists on remote, check if up to date
    git fetch origin "${CURRENT_BRANCH}" 2>/dev/null || true
    
    LOCAL_COMMIT=$(git rev-parse HEAD)
    REMOTE_COMMIT=$(git rev-parse "origin/${CURRENT_BRANCH}" 2>/dev/null || echo "")
    
    if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
        echo -e "   ${GREEN}✅ Branch is up to date with origin/${CURRENT_BRANCH}${NC}"
    elif [ -z "$REMOTE_COMMIT" ]; then
        echo -e "   ${YELLOW}⚠️  Remote branch origin/${CURRENT_BRANCH} not found${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Branch is not up to date with origin/${CURRENT_BRANCH}${NC}"
        echo "   Run: git push origin ${CURRENT_BRANCH}"
    fi
else
    echo -e "   ${BLUE}ℹ️  Branch does not exist on remote yet${NC}"
    echo "   Run: git push origin ${CURRENT_BRANCH}"
fi

# Check 4: Main branch sync status
echo ""
echo "4. Main Branch Sync Status"
echo "   ------------------------"

if [ "$CURRENT_BRANCH" != "main" ]; then
    git fetch origin main 2>/dev/null || true
    
    # Check if current branch is behind main
    BEHIND_COUNT=$(git rev-list --count HEAD..origin/main)
    AHEAD_COUNT=$(git rev-list --count origin/main..HEAD)
    
    if [ "$BEHIND_COUNT" -eq 0 ]; then
        echo -e "   ${GREEN}✅ Branch is up to date with origin/main${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Branch is ${BEHIND_COUNT} commits behind origin/main${NC}"
        echo "   Consider merging main: git merge origin/main"
        VALIDATION_PASSED=false
    fi
    
    if [ "$AHEAD_COUNT" -gt 0 ]; then
        echo -e "   ${BLUE}ℹ️  Branch is ${AHEAD_COUNT} commits ahead of origin/main${NC}"
    fi
else
    echo -e "   ${GREEN}✅ On main branch${NC}"
fi

# Check 5: Build and lint status
echo ""
echo "5. Build and Lint Status"
echo "   ---------------------"

if npm run lint > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Linting passes${NC}"
else
    echo -e "   ${RED}❌ Linting failed${NC}"
    echo "   Run: npm run lint"
    VALIDATION_PASSED=false
fi

if npm run build > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Build passes${NC}"
else
    echo -e "   ${RED}❌ Build failed${NC}"
    echo "   Run: npm run build"
    VALIDATION_PASSED=false
fi

# Check 6: Detect common workflow issues
echo ""
echo "6. Common Workflow Issues"
echo "   ----------------------"

# Check for stale branches
STALE_BRANCHES=$(git for-each-ref --format='%(refname:short) %(committerdate:relative)' refs/heads | grep -v main | grep -E '(week|month|year)' || true)
if [ -n "$STALE_BRANCHES" ]; then
    echo -e "   ${YELLOW}⚠️  Found potentially stale branches:${NC}"
    echo "$STALE_BRANCHES" | sed 's/^/      /'
    echo "   Consider cleaning up old branches"
fi

# Check for multiple active branches
BRANCH_COUNT=$(git branch | grep -v main | wc -l)
if [ "$BRANCH_COUNT" -gt 5 ]; then
    echo -e "   ${YELLOW}⚠️  Many active branches (${BRANCH_COUNT}). Consider cleanup.${NC}"
    echo "   List branches: git branch"
    echo "   Cleanup merged: git branch --merged main | grep -v main | xargs -r git branch -d"
fi

# Overall validation result
echo ""
echo -e "${BLUE}📋 Validation Summary${NC}"
echo "===================="

if [ "$VALIDATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo -e "${BLUE}🚀 Ready for:${NC}"
    if [ "$CURRENT_BRANCH" = "main" ]; then
        echo "• Creating a new feature branch: ./create-feature-branch.sh \"feature-description\""
    else
        echo "• Making commits and pushing changes"
        echo "• Creating a pull request"
    fi
else
    echo -e "${RED}❌ Some issues found that should be addressed${NC}"
    echo ""
    echo -e "${BLUE}🔧 Next steps:${NC}"
    echo "• Fix linting/build issues"
    echo "• Sync with main branch"
    echo "• Address any warnings above"
fi

echo ""
echo -e "${BLUE}💡 Workflow Tips:${NC}"
echo "• Always start from main: git checkout main && git pull origin main"
echo "• Use descriptive branch names with prefixes (feature/, bugfix/, etc.)"
echo "• Commit frequently with clear messages"
echo "• Test before pushing: npm run lint && npm run build"
echo "• Clean up branches after merge"
echo ""

exit $([ "$VALIDATION_PASSED" = true ] && echo 0 || echo 1)