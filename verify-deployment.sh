#!/bin/bash

echo "🚀 Firebase Functions Deployment Verification"
echo "=============================================="

# Check if we're in the right directory
if [[ ! -d "functions" ]]; then
    echo "❌ Error: functions directory not found. Run this script from the repository root."
    exit 1
fi

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found: $(firebase --version)"

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

echo "✅ Firebase authentication verified"

# Check if project is configured
if [[ ! -f ".firebaserc" ]]; then
    echo "❌ Firebase project not configured. Please run: firebase init"
    exit 1
fi

PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
echo "✅ Firebase project configured: $PROJECT_ID"

# Build functions
echo "🔨 Building functions..."
cd functions
if ! npm run build; then
    echo "❌ Functions build failed"
    exit 1
fi
cd ..

echo "✅ Functions built successfully"

# Check if functions can be deployed (dry run)
echo "🔍 Verifying deployment configuration..."
if firebase use --clear && firebase use "$PROJECT_ID"; then
    echo "✅ Project configuration verified"
else
    echo "❌ Project configuration error"
    exit 1
fi

echo ""
echo "✅ All checks passed! You can now deploy with:"
echo "   cd functions"
echo "   firebase deploy --only functions"
echo ""
echo "📝 After deployment, update lib/rebeccaConfig.ts with your function URL:"
echo "   https://[region]-$PROJECT_ID.cloudfunctions.net/api"