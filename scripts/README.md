# 🛠️ Workflow Helper Scripts

This directory contains helper scripts to automate the pull request workflow described in [CONTRIBUTING.md](../CONTRIBUTING.md).

## Scripts Overview

### 🌿 `new-feature.sh`
**Purpose**: Start a new feature branch with proper naming conventions

**Usage**: 
```bash
./scripts/new-feature.sh "feature-description"
```

**Examples**:
```bash
./scripts/new-feature.sh "add-user-authentication"
./scripts/new-feature.sh "fix-navigation-bug"
./scripts/new-feature.sh "update-readme"
```

**What it does**:
- Switches to main branch and pulls latest changes
- Creates a new feature branch with appropriate prefix (feature/, fix/, docs/, refactor/)
- Provides next steps guidance

### 🧹 `cleanup-branch.sh`
**Purpose**: Clean up merged feature branches

**Usage**:
```bash
# Interactive mode - select from recent branches
./scripts/cleanup-branch.sh

# Direct mode - specify branch name
./scripts/cleanup-branch.sh feature/my-feature
```

**What it does**:
- Switches to main and pulls latest changes
- Deletes local and remote feature branches
- Shows current repository status

### ✅ `validate-changes.sh`
**Purpose**: Validate changes before submitting PR

**Usage**:
```bash
./scripts/validate-changes.sh
```

**What it checks**:
- ✅ Project builds successfully
- ✅ Working directory status
- ✅ Branch naming conventions
- ✅ Environment configuration
- ✅ Security vulnerabilities
- ✅ Commit status

## 🔄 Complete Workflow Example

Here's how to use these scripts for a complete feature development cycle:

```bash
# 1. Start new feature
./scripts/new-feature.sh "add-chat-history"

# 2. Make your changes
# ... edit files, test locally ...

# 3. Validate before committing
./scripts/validate-changes.sh

# 4. Commit and push
git add .
git commit -m "Add chat history functionality"
git push origin feature/add-chat-history

# 5. Open PR on GitHub
# ... create PR through GitHub UI ...

# 6. After PR is merged, cleanup
./scripts/cleanup-branch.sh feature/add-chat-history
```

## 🔧 Script Requirements

All scripts require:
- Bash shell
- Git command line tools
- Node.js and npm (for validation script)
- Active git repository

## 🐛 Troubleshooting

**Permission denied errors**:
```bash
chmod +x scripts/*.sh
```

**Git authentication issues**:
- Ensure you have proper git credentials configured
- Scripts may fail in environments without git push/pull access

**Build validation fails**:
- Run `npm install` first
- Check that `npm run build` works locally

## 📚 Additional Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Complete contribution workflow
- [README.md](../README.md) - Project setup and overview
- [.github/pull_request_template.md](../.github/pull_request_template.md) - PR template