# Contributing to Rebecca AI Studio

Thank you for contributing to Rebecca AI Studio! This guide outlines our workflow for making changes and submitting pull requests.

## 🔄 Workflow for New Changes & Pull Requests

Our workflow ensures that every change gets its own PR with a unique number, maintaining clear GitHub history and deployment tracking.

### 1. Start Fresh from Main

Always start with the latest code from the main branch:

```bash
git checkout main
git pull origin main
```

### 2. Create a New Feature Branch

Create a descriptive branch for your change (replace `feature/your-change` with something meaningful):

```bash
git checkout -b feature/your-change
```

**Branch naming conventions:**
- `feature/add-new-component` - for new features
- `fix/bug-description` - for bug fixes
- `docs/update-readme` - for documentation changes
- `refactor/improve-performance` - for code improvements

### 3. Make Your Changes

1. Make your code changes
2. Test your changes locally:
   ```bash
   npm run dev
   npm run build  # Ensure build still works
   ```
3. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Describe your change here"
   ```

**Commit message guidelines:**
- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Reference issues when applicable: "Fix navigation bug (#123)"

### 4. Push Your Branch

Push your branch to GitHub:

```bash
git push origin feature/your-change
```

### 5. Open a Pull Request

1. Go to your repository on GitHub
2. Click the "Compare & pull request" button for your new branch
3. Fill in the PR title and description:
   - **Title**: Clear, descriptive summary of the change
   - **Description**: What changed, why it changed, and how to test it

### 6. After Your PR is Merged

Clean up your local repository:

```bash
git checkout main
git pull origin main
git branch -d feature/your-change
git push origin --delete feature/your-change
```

## 🎯 What This Workflow Achieves

- ✅ **Unique PR Numbers**: Every change gets a new PR and number
- ✅ **Clear History**: GitHub history clearly shows each distinct change
- ✅ **Clean Deployments**: Deployments are tied to specific changes
- ✅ **No Reused Branches**: Fresh branches prevent confusion and conflicts

## 🛠️ Helper Scripts

We provide helper scripts to automate parts of this workflow:

### Quick Start Script

```bash
./scripts/new-feature.sh "your-feature-description"
```

### Cleanup Script

```bash
./scripts/cleanup-branch.sh
```

## 🔍 Pre-Submission Checklist

Before opening your PR, ensure:

- [ ] Code builds successfully (`npm run build`)
- [ ] Changes work in development mode (`npm run dev`)
- [ ] Commit messages are clear and descriptive
- [ ] Branch name follows naming conventions
- [ ] No placeholder values in configuration files

## 🚀 Deployment Process

Our repository uses automated deployment:

1. **Development**: All branches can be tested locally
2. **Staging**: PRs trigger preview deployments (if configured)
3. **Production**: Merging to `main` triggers automatic deployment to Firebase Hosting

## 📋 Code Review Process

1. All PRs require review before merging
2. Automated checks must pass (build, linting)
3. Changes should be focused and atomic
4. Large changes should be broken into smaller PRs when possible

## ❓ Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check existing docs in the repository

---

## 🔧 Development Setup

If you're new to the project, follow these setup steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iansmith35/Rebecca-ai-studio-.git
   cd Rebecca-ai-studio-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📚 Additional Resources

- [README.md](README.md) - Project overview and setup
- [Firebase Setup](FIREBASE_HOSTING_SETUP.md) - Deployment configuration
- [Backend Setup](functions/README.md) - Backend deployment guide

Thank you for contributing to Rebecca AI Studio! 🚀