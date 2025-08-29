# Git Workflow for Unique Pull Requests

This document provides a complete guide for making changes to the Rebecca AI Studio repository with proper branch management and unique PR numbers.

## Overview

Every change should follow this workflow to ensure:
- ✅ Each PR gets a new, incrementing number
- ✅ Clear record of all work
- ✅ Clean git history
- ✅ No reused or conflicting branches
- ✅ Proper deployment tracking

## Prerequisites

Before starting, ensure you have:
- Git installed and configured
- Repository cloned locally
- `origin` remote pointing to your GitHub repo
- Proper access permissions to create branches and PRs

## Complete Workflow

### 1. Start from Main Branch

Always start with the latest main branch:

```bash
git checkout main
git pull origin main
```

**Why this matters:** Ensures you're working with the latest code and prevents merge conflicts.

### 2. Create a New Feature Branch

Create a descriptive branch for your change:

```bash
# Replace 'feature/your-change' with a descriptive name
git checkout -b feature/your-change
```

**Branch Naming Convention:**
- `feature/add-user-authentication`
- `bugfix/fix-email-validation`
- `docs/update-deployment-guide`
- `refactor/cleanup-api-endpoints`

### 3. Make Your Changes

Work on your changes normally:
- Edit files
- Test your changes locally
- Run linting and builds: `npm run lint && npm run build`

### 4. Stage and Commit Changes

```bash
git add .
git commit -m "Describe your change here"
```

**Good commit messages:**
- "Add user authentication with Firebase Auth"
- "Fix email validation bug in contact form"
- "Update deployment documentation for Firebase"
- "Refactor API endpoints for better error handling"

### 5. Push Branch to GitHub

```bash
git push origin feature/your-change
```

This creates the branch on GitHub and makes it available for PR creation.

### 6. Create Pull Request

1. Go to your repository on GitHub
2. You'll see a "Compare & pull request" button - click it
3. Fill in the PR title and description
4. Add relevant labels and reviewers
5. Click "Create pull request"

**Each PR will automatically get a new, unique number** (e.g., #1, #2, #3, etc.)

### 7. After PR is Merged

Clean up your local environment:

```bash
# Switch back to main
git checkout main

# Pull the latest changes (including your merged PR)
git pull origin main

# Delete the local feature branch
git branch -d feature/your-change

# Delete the remote branch
git push origin --delete feature/your-change
```

## What This Achieves

### ✅ Unique PR Numbers
Every time you follow this workflow, GitHub automatically assigns a new PR number.

### ✅ Clean History
- No reused branches
- Clear commit history
- Easy to track changes

### ✅ Deployment Tracking
- Each merge triggers deployment (via GitHub Actions)
- Firebase Hosting gets updated automatically
- Cloud Run revisions roll with each merge

### ✅ No Conflicts
- Starting from main prevents most merge conflicts
- Fresh branches avoid branch pollution

## Helper Scripts

### Quick Branch Creation

Use the provided script for faster branch creation:

```bash
./create-feature-branch.sh "your-feature-description"
```

### Automated Cleanup

After PR merge, use the cleanup script:

```bash
./cleanup-branch.sh feature/your-change
```

## Common Scenarios

### Multiple Changes in Progress

If working on multiple features:

```bash
# Feature 1
git checkout main
git pull origin main
git checkout -b feature/user-auth
# ... work on user auth

# Feature 2 (start fresh from main)
git checkout main
git pull origin main
git checkout -b feature/email-validation
# ... work on email validation
```

### Updating an In-Progress Branch

If main branch gets updated while you're working:

```bash
# Update main
git checkout main
git pull origin main

# Update your feature branch
git checkout feature/your-change
git merge main

# Or rebase if you prefer
git rebase main
```

### Emergency Hotfixes

For urgent fixes:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix
# ... make minimal fix
git add .
git commit -m "Fix critical bug causing server errors"
git push origin hotfix/critical-bug-fix
# Create PR immediately
```

## Best Practices

### Branch Naming
- Use descriptive names
- Include type prefix (`feature/`, `bugfix/`, `docs/`, etc.)
- Keep names concise but clear

### Commit Messages
- Use imperative mood ("Add feature" not "Added feature")
- Keep first line under 50 characters
- Include details in body if needed

### PR Management
- One feature per PR
- Keep PRs focused and small
- Include screenshots for UI changes
- Add clear descriptions

## Deployment Integration

The repository is configured with GitHub Actions that automatically:
- Build and test on PR creation
- Deploy to Firebase Hosting on merge to main
- Update Cloud Run services

This means every merged PR automatically creates:
- New deployment
- New Firebase Hosting version
- New Cloud Run revision

## Troubleshooting

### "Branch already exists"
```bash
# Delete old branch first
git branch -d feature/old-branch
git push origin --delete feature/old-branch

# Then create new branch
git checkout -b feature/new-branch
```

### "Nothing to commit"
```bash
# Check what files changed
git status
git diff

# Stage specific files
git add path/to/file
```

### "Permission denied"
- Ensure you have write access to the repository
- Check your GitHub authentication
- Verify remote URL: `git remote -v`

## Summary

Following this workflow ensures:
1. 🎯 **Unique PRs** - Every change gets a new PR number
2. 📈 **Clear tracking** - Easy to see what was changed when
3. 🚀 **Smooth deployments** - Automatic deployment on merge
4. 🧹 **Clean history** - No branch pollution or conflicts
5. 👥 **Team collaboration** - Consistent workflow for everyone

Remember: **One branch per change, one PR per branch, always start from main.**