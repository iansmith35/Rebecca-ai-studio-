#!/bin/bash

echo "🔥 Firebase Hosting Setup Validation"
echo "===================================="
echo

# Check if .github/workflows directory exists
if [ -d ".github/workflows" ]; then
    echo "✅ GitHub Actions workflow directory exists"
else
    echo "❌ GitHub Actions workflow directory missing"
    exit 1
fi

# Check if workflow file exists
if [ -f ".github/workflows/firebase-hosting-deploy.yml" ]; then
    echo "✅ Firebase Hosting deploy workflow exists"
else
    echo "❌ Firebase Hosting deploy workflow missing"
    exit 1
fi

# Check if firebase.json has hosting config
if grep -q '"hosting"' firebase.json; then
    echo "✅ Firebase hosting configuration found"
else
    echo "❌ Firebase hosting configuration missing"
    exit 1
fi

# Check if Next.js is configured for export
if grep -q "output.*export" next.config.js; then
    echo "✅ Next.js configured for static export"
else
    echo "❌ Next.js not configured for static export"
    exit 1
fi

# Check if .firebaserc has placeholder
if grep -q "your-firebase-project-id" .firebaserc; then
    echo "⚠️  WARNING: .firebaserc contains placeholder project ID"
    echo "   Please update with your actual Firebase project ID"
fi

# Check if project builds
echo "🔨 Testing build process..."
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Project builds successfully"
    if [ -d "dist" ]; then
        echo "✅ Static files generated in dist/ directory"
        FILE_COUNT=$(ls -1 dist/ | wc -l)
        echo "   Generated $FILE_COUNT files/directories"
    else
        echo "❌ dist/ directory not found after build"
        exit 1
    fi
else
    echo "❌ Build failed"
    echo "Build output:"
    cat /tmp/build.log
    exit 1
fi

echo
echo "🎉 All checks passed!"
echo
echo "📝 Next steps:"
echo "1. Update .firebaserc with your Firebase project ID"
echo "2. Add FIREBASE_SERVICE_ACCOUNT_REBECCA_DASHBORD secret to GitHub repository"
echo "3. Update projectId in .github/workflows/firebase-hosting-deploy.yml if needed"
echo "4. Push to main branch to trigger deployment"
echo