#!/bin/bash

echo "=== FORCE DEPLOYING TO ALL REGIONS ==="
echo "$(date)"
echo "-----------------------------------"

# Function to check if Firebase CLI is available
check_firebase_cli() {
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
    if ! firebase projects:list &> /dev/null; then
        echo "❌ Not logged in to Firebase. Please run: firebase login"
        exit 1
    fi
    
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    echo "✅ Using Firebase project: $PROJECT_ID"
}

# Function to build the application
build_app() {
    echo ""
    echo "🔨 Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Application build failed"
        exit 1
    fi
    echo "✅ Application built successfully"
}

# Function to build functions
build_functions() {
    echo ""
    echo "🔨 Building Firebase Functions..."
    cd functions
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Functions build failed"
        cd ..
        exit 1
    fi
    cd ..
    echo "✅ Functions built successfully"
}

# Function to deploy hosting and functions for both regions
deploy_all() {
    echo ""
    echo "🚀 Force deploying to ALL targets..."
    
    # Deploy to rebecca-dashboard with europe-west4 functions
    echo ""
    echo "📍 Deploying rebecca-dashboard (Europe West 4)..."
    firebase deploy --only hosting:rebecca-dashboard,functions:europe-west4 --force
    if [ $? -ne 0 ]; then
        echo "❌ rebecca-dashboard deployment failed"
        exit 1
    fi
    echo "✅ rebecca-dashboard deployed successfully"
    
    # Deploy to empirehq with us-central1 functions  
    echo ""
    echo "📍 Deploying empirehq (US Central 1)..."
    firebase deploy --only hosting:empirehq,functions:us-central1 --force
    if [ $? -ne 0 ]; then
        echo "❌ empirehq deployment failed"
        exit 1
    fi
    echo "✅ empirehq deployed successfully"
}

# Function to show deployment URLs
show_urls() {
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    
    echo ""
    echo "🎉 FORCE DEPLOYMENT COMPLETE!"
    echo "================================"
    echo ""
    echo "📝 Deployment URLs:"
    echo "• Rebecca Dashboard: https://rebecca-dashboard--$PROJECT_ID.web.app"
    echo "• Empire HQ: https://empirehq--$PROJECT_ID.web.app"
    echo ""
    echo "🔧 Function URLs:"
    echo "• Europe West 4: https://europe-west4-$PROJECT_ID.cloudfunctions.net"
    echo "• US Central 1: https://us-central1-$PROJECT_ID.cloudfunctions.net"
    echo ""
    echo "✅ Both targets have been force deployed with the latest code from PR #54"
}

# Main execution
main() {
    check_firebase_cli
    verify_config
    build_app
    build_functions
    deploy_all
    show_urls
}

# Run the script
main "$@"