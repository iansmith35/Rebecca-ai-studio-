#!/bin/bash

# Exit on any error
set -e

echo "==============================================="
echo "🚀 AGGRESSIVE FORCE RESET & DEPLOY"
echo "==============================================="
echo "$(date)"
echo ""
echo "This script will perform a complete reset and force deployment:"
echo "• Clear all caches"
echo "• Reset to latest code from main branch"
echo "• Perform complete rebuild"
echo "• Force deploy to both targets with cache-busting"
echo "• Create timestamp marker"
echo ""

# Function to check if Firebase CLI is available
check_firebase_cli() {
    echo "🔍 Checking Firebase CLI..."
    if ! command -v firebase &> /dev/null; then
        echo "❌ Firebase CLI not found. Installing..."
        npm install -g firebase-tools
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install Firebase CLI"
            exit 1
        fi
    fi
    echo "✅ Firebase CLI ready"
}

# Function to verify project configuration
verify_config() {
    echo ""
    echo "🔍 Verifying Firebase configuration..."
    if ! firebase projects:list &> /dev/null; then
        echo "❌ Not logged in to Firebase. Please run: firebase login"
        exit 1
    fi
    
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    echo "✅ Using Firebase project: $PROJECT_ID"
}

# Function to perform hard reset and cache clearing
hard_reset() {
    echo ""
    echo "🧹 Performing hard reset and cache clearing..."
    
    # Clear npm cache
    echo "• Clearing npm cache..."
    npm cache clean --force
    
    # Remove node_modules and reinstall (aggressive cache clear)
    echo "• Removing node_modules..."
    rm -rf node_modules
    rm -rf package-lock.json
    
    # Remove build outputs
    echo "• Removing previous build outputs..."
    rm -rf out
    rm -rf dist
    rm -rf .next
    
    # Clear Firebase cache
    echo "• Clearing Firebase cache..."
    firebase --clear-cache 2>/dev/null || echo "  (Firebase cache cleared or not present)"
    
    # Reset to latest main branch
    echo "• Resetting to latest main branch..."
    git fetch origin
    git reset --hard origin/main
    git clean -fd
    
    echo "✅ Hard reset and cache clearing complete"
}

# Function to fresh install and build
fresh_build() {
    echo ""
    echo "🔨 Performing fresh installation and build..."
    
    # Fresh npm install
    echo "• Fresh npm install..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
    
    # Build application
    echo "• Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Application build failed"
        exit 1
    fi
    echo "✅ Application built successfully to 'out' directory"
    
    # Build functions if they exist
    if [ -d "functions" ]; then
        echo "• Building Firebase Functions..."
        cd functions
        npm install
        npm run build
        if [ $? -ne 0 ]; then
            echo "❌ Functions build failed"
            cd ..
            exit 1
        fi
        cd ..
        echo "✅ Functions built successfully"
    fi
}

# Function to create timestamp marker
create_timestamp_marker() {
    echo ""
    echo "📝 Creating deployment timestamp marker..."
    
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S UTC')
    echo "Deployment completed at: $TIMESTAMP" > out/deployment-timestamp.txt
    echo "Force reset deployment from: $(git rev-parse HEAD)" >> out/deployment-timestamp.txt
    echo "✅ Timestamp marker created"
}

# Function to force deploy with cache-busting
force_deploy_all() {
    echo ""
    echo "🚀 Force deploying to ALL targets with cache-busting..."
    
    # Deploy to rebecca-dashboard with europe-west4 functions
    echo ""
    echo "📍 Force deploying rebecca-dashboard (Europe West 4)..."
    firebase deploy --only hosting:rebecca-dashboard,functions:europe-west4 --force
    if [ $? -ne 0 ]; then
        echo "❌ rebecca-dashboard deployment failed"
        exit 1
    fi
    echo "✅ rebecca-dashboard force deployed successfully"
    
    # Deploy to empirehq with us-central1 functions  
    echo ""
    echo "📍 Force deploying empirehq (US Central 1)..."
    firebase deploy --only hosting:empirehq,functions:us-central1 --force
    if [ $? -ne 0 ]; then
        echo "❌ empirehq deployment failed"
        exit 1
    fi
    echo "✅ empirehq force deployed successfully"
}

# Function to show deployment results
show_deployment_results() {
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S UTC')
    
    echo ""
    echo "🎉 AGGRESSIVE FORCE DEPLOYMENT COMPLETE!"
    echo "========================================"
    echo ""
    echo "📝 Deployment URLs:"
    echo "• Rebecca Dashboard: https://rebecca-dashboard--$PROJECT_ID.web.app"
    echo "• Empire HQ: https://empirehq--$PROJECT_ID.web.app"
    echo ""
    echo "🔧 Function URLs:"
    echo "• Europe West 4: https://europe-west4-$PROJECT_ID.cloudfunctions.net"
    echo "• US Central 1: https://us-central1-$PROJECT_ID.cloudfunctions.net"
    echo ""
    echo "✅ Both targets deployed with latest code from main branch"
    echo "⏰ Deployment completed at: $TIMESTAMP"
    echo "🔄 Commit: $(git rev-parse HEAD)"
    echo ""
    echo "🌐 Verification URLs:"
    echo "• Check timestamp: https://rebecca-dashboard--$PROJECT_ID.web.app/deployment-timestamp.txt"
    echo "• Check timestamp: https://empirehq--$PROJECT_ID.web.app/deployment-timestamp.txt"
}

# Main execution
main() {
    echo "🚨 WARNING: This is an aggressive deployment that will:"
    echo "• Clear all caches and dependencies"
    echo "• Reset your working directory to latest main"
    echo "• Any uncommitted changes will be LOST"
    echo ""
    read -p "Continue with aggressive deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    check_firebase_cli
    verify_config
    hard_reset
    fresh_build
    create_timestamp_marker
    force_deploy_all
    show_deployment_results
}

# Run the script
main "$@"