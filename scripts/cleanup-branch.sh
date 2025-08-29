#!/bin/bash

# Helper script to cleanup after a feature branch has been merged
# Usage: ./scripts/cleanup-branch.sh [branch-name]
# If no branch name provided, it will prompt to select from recent branches

set -e

echo "🧹 Starting branch cleanup..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Function to cleanup a specific branch
cleanup_branch() {
    local branch_name="$1"
    
    if [ -z "$branch_name" ]; then
        echo "❌ Error: No branch name provided"
        return 1
    fi
    
    # Don't allow cleanup of main or current branch
    if [ "$branch_name" = "main" ]; then
        echo "❌ Error: Cannot cleanup main branch"
        return 1
    fi
    
    current_branch=$(git branch --show-current)
    if [ "$branch_name" = "$current_branch" ]; then
        echo "⚠️  Currently on branch '$branch_name', switching to main first..."
        git checkout main
    fi
    
    echo "📡 Fetching latest changes..."
    git fetch origin
    
    echo "⬇️  Pulling latest main..."
    git pull origin main
    
    # Check if local branch exists
    if git show-ref --verify --quiet refs/heads/"$branch_name"; then
        echo "🗑️  Deleting local branch: $branch_name"
        git branch -d "$branch_name" || {
            echo "⚠️  Branch not fully merged locally, force deleting..."
            git branch -D "$branch_name"
        }
    else
        echo "ℹ️  Local branch '$branch_name' not found"
    fi
    
    # Check if remote branch exists
    if git show-ref --verify --quiet refs/remotes/origin/"$branch_name"; then
        echo "🗑️  Deleting remote branch: $branch_name"
        git push origin --delete "$branch_name" || {
            echo "⚠️  Could not delete remote branch (may already be deleted)"
        }
    else
        echo "ℹ️  Remote branch '$branch_name' not found"
    fi
    
    echo "✅ Cleanup complete for branch: $branch_name"
}

# If branch name provided as argument, use it
if [ $# -gt 0 ]; then
    cleanup_branch "$1"
else
    echo "📋 Recent non-main branches:"
    echo ""
    
    # Get list of recent local branches (excluding main)
    branches=$(git for-each-ref --format='%(refname:short)' --sort=-committerdate refs/heads | grep -v '^main$' | head -10)
    
    if [ -z "$branches" ]; then
        echo "ℹ️  No feature branches found to cleanup"
        exit 0
    fi
    
    # Display branches with numbers
    i=1
    declare -a branch_array
    for branch in $branches; do
        echo "  $i) $branch"
        branch_array[$i]=$branch
        ((i++))
    done
    
    echo ""
    echo "Select branch to cleanup (number), or 'q' to quit:"
    read -r selection
    
    if [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
        echo "👋 Exiting cleanup"
        exit 0
    fi
    
    # Validate selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#branch_array[@]} ]; then
        echo "❌ Error: Invalid selection"
        exit 1
    fi
    
    selected_branch="${branch_array[$selection]}"
    echo ""
    echo "🎯 Selected branch: $selected_branch"
    echo "⚠️  This will delete both local and remote versions of this branch."
    echo "❓ Are you sure? (y/N):"
    read -r confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ] || [ "$confirm" = "yes" ]; then
        cleanup_branch "$selected_branch"
    else
        echo "👋 Cleanup cancelled"
    fi
fi

echo ""
echo "📋 Current status:"
git status --short
echo ""
echo "🌿 Current branch: $(git branch --show-current)"