# Git Workflow - Quick Reference

## 🚀 New Feature Workflow

```bash
# 1. Start fresh from main
git checkout main
git pull origin main

# 2. Create feature branch (or use helper script)
git checkout -b feature/your-feature-name
# OR
./create-feature-branch.sh "your-feature-name"

# 3. Make changes and commit
git add .
git commit -m "Add your feature description"

# 4. Push and create PR
git push origin feature/your-feature-name
# Go to GitHub and create Pull Request

# 5. After PR is merged, cleanup
git checkout main
git pull origin main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
# OR
./cleanup-branch.sh feature/your-feature-name
```

## 🛠️ Helper Scripts

| Script | Purpose |
|--------|---------|
| `./create-feature-branch.sh "description"` | Creates new branch from latest main |
| `./cleanup-branch.sh branch-name` | Cleans up after PR merge |
| `./validate-workflow.sh` | Validates current workflow state |

## 📝 Branch Naming

- `feature/add-user-authentication`
- `bugfix/fix-email-validation` 
- `docs/update-deployment-guide`
- `refactor/cleanup-api-endpoints`
- `hotfix/critical-security-fix`

## ✅ Benefits

- ✨ Unique PR numbers every time
- 🧹 Clean git history
- 🚀 Automatic deployments on merge
- 👥 Consistent team workflow
- 🔄 Easy branch management

## 🆘 Common Commands

```bash
# Check current status
git status
git branch --show-current

# See all branches
git branch -a

# Validate workflow
./validate-workflow.sh

# Emergency: force delete branch
git branch -D branch-name
git push origin --delete branch-name
```

---
**Remember:** One branch per feature, always start from main, cleanup after merge!