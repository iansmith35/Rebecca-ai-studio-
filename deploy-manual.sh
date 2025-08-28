#!/bin/bash

echo "🚀 Rebecca AI Studio - Manual Deployment Script"
echo "=============================================="

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI ready"

# Check if project is configured
if grep -q "your-firebase-project-id\|your-project-id" .firebaserc; then
    echo "⚠️  WARNING: .firebaserc contains placeholder values!"
    echo "   Please update with your actual Firebase project ID:"
    echo "   firebase use --add your-actual-project-id"
    echo ""
    echo "   Or manually edit .firebaserc"
    exit 1
fi

# Build functions
echo "🔨 Building Firebase Functions..."
cd functions
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Functions build failed"
    exit 1
fi
cd ..

echo "✅ Functions built successfully"

# Deploy functions
echo "🚀 Deploying Firebase Functions..."
cd functions
firebase deploy --only functions
if [ $? -ne 0 ]; then
    echo "❌ Functions deployment failed"
    exit 1
fi
cd ..

echo "✅ Functions deployed successfully"

# Get project ID for URL construction
PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update your .env.local file with the deployed function URL:"
echo "   NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-$PROJECT_ID.cloudfunctions.net/api"
echo ""
echo "2. Test the backend connectivity:"
echo "   npm run dev"
echo "   Open http://localhost:3000 and verify the API calls work"
echo ""
echo "3. Deploy the frontend to Vercel/Firebase Hosting"
echo ""
echo "4. Update production environment variables with the function URL"
echo ""