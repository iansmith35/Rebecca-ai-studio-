#!/bin/bash

echo "🚀 Rebecca AI Studio - Deployment Configuration Check"
echo "====================================================="

# Check Firebase project configuration
echo "Checking Firebase project configuration..."
if [[ -f ".firebaserc" ]]; then
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    
    if [[ "$PROJECT_ID" == "your-firebase-project-id" ]]; then
        echo "❌ Firebase project uses placeholder ID: $PROJECT_ID"
        echo "   Fix: Update .firebaserc with real project ID"
    else
        echo "✅ Firebase project configured: $PROJECT_ID"
    fi
else
    echo "❌ .firebaserc not found"
fi

# Check environment configuration
echo ""
echo "Checking environment configuration..."
if [[ -f ".env.local" ]]; then
    echo "✅ .env.local exists"
    if grep -q "your-project-id\|your-firebase" .env.local; then
        echo "⚠️  Contains placeholder values - update with real Firebase config"
    else
        echo "✅ Environment appears configured"
    fi
else
    echo "❌ .env.local missing"
fi

# Check build
echo ""
echo "Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
fi

echo ""
echo "📋 Summary:"
echo "- Deployment verification UI changes: ACTIVE"
echo "- Check your hosting platform deploy branch settings"
echo "- Manual deployment trigger recommended to test pipeline"
echo ""