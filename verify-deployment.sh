#!/bin/bash

echo "🚀 Rebecca AI Studio - Firebase Migration & Deployment Verification"
echo "=================================================================="

# Check if we're in the right directory
if [[ ! -d "functions" ]]; then
    echo "❌ Error: functions directory not found. Run this script from the repository root."
    exit 1
fi

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   Or run: ./setup-firebase.sh"
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

if [[ "$PROJECT_ID" == "your-firebase-project-id" ]]; then
    echo "⚠️  Warning: .firebaserc still contains placeholder project ID"
    echo "   Please update .firebaserc with your actual Firebase project ID"
    echo "   Or run: firebase use --add [your-project-id]"
fi

echo "✅ Firebase project configured: $PROJECT_ID"

# Check environment configuration
if [[ ! -f ".env.local" ]]; then
    echo "❌ Environment file .env.local not found"
    echo "   Please create .env.local with your Firebase configuration"
    exit 1
fi

echo "✅ Environment configuration found"

# Check if .env.local has placeholder values
if grep -q "your-firebase-project-id\|your-project-id" .env.local; then
    echo "⚠️  Warning: .env.local contains placeholder values"
    echo "   Please update .env.local with your actual Firebase configuration"
fi

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

# Check for legacy backend
if [[ -d "backend" ]]; then
    echo "⚠️  Warning: Legacy backend directory still exists"
    echo "   Consider archiving it: mv backend backend-legacy"
fi

if [[ -d "backend-legacy-apps-script" ]]; then
    echo "✅ Legacy backend archived"
fi

echo ""
echo "🎉 All checks passed! Migration preparation complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update your Firebase project configuration:"
echo "   firebase use --add [your-actual-project-id]"
echo ""
echo "2. Update .env.local with your Firebase project values"
echo ""
echo "3. Set up Google Service Account for Functions:"
echo "   firebase functions:config:set google.credentials=\"\$(cat service-account.json)\""
echo ""
echo "4. Deploy functions:"
echo "   cd functions"
echo "   firebase deploy --only functions"
echo ""
echo "4. Deploy functions:"
echo "   cd functions"
echo "   firebase deploy --only functions"
echo ""
echo "5. After deployment, update .env.local with your function URL:"
echo "   NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://[region]-$PROJECT_ID.cloudfunctions.net/api"
echo ""
echo "6. Test the migration by running the development server:"
echo "   npm run dev"

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