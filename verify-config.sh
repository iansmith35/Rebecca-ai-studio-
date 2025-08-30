#!/bin/bash

echo "🔍 DEPLOYMENT CONFIGURATION VERIFICATION"
echo "========================================"
echo ""

# Function to check configuration files
check_config_files() {
    echo "📋 Checking configuration files..."
    
    if [[ -f ".firebaserc" ]]; then
        echo "✅ .firebaserc exists"
        PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
        echo "   Project ID: $PROJECT_ID"
        
        # Check if targets are properly defined
        if grep -q "rebecca-dashboard" .firebaserc; then
            echo "   ✅ rebecca-dashboard target defined"
        else
            echo "   ❌ rebecca-dashboard target missing"
        fi
        
        if grep -q "empirehq" .firebaserc; then
            echo "   ✅ empirehq target defined"
        else
            echo "   ❌ empirehq target missing"
        fi
    else
        echo "❌ .firebaserc missing"
        return 1
    fi
    
    if [[ -f "firebase.json" ]]; then
        echo "✅ firebase.json exists"
        
        # Check hosting configurations
        if grep -q '"target": "rebecca-dashboard"' firebase.json; then
            echo "   ✅ rebecca-dashboard hosting config found"
        else
            echo "   ❌ rebecca-dashboard hosting config missing"
        fi
        
        if grep -q '"target": "empirehq"' firebase.json; then
            echo "   ✅ empirehq hosting config found"
        else
            echo "   ❌ empirehq hosting config missing"
        fi
        
        # Check functions configuration
        if grep -q '"functions"' firebase.json; then
            echo "   ✅ functions configuration found"
        else
            echo "   ❌ functions configuration missing"
        fi
    else
        echo "❌ firebase.json missing"
        return 1
    fi
}

# Function to verify environment configuration
check_environment_config() {
    echo ""
    echo "🌍 Checking environment configuration..."
    
    if [[ -f "app/config/environments.ts" ]]; then
        echo "✅ environments.ts exists"
        
        # Check if both environments are defined
        if grep -q "empirehq:" app/config/environments.ts; then
            echo "   ✅ empirehq environment defined"
            EMPIREHQ_REGION=$(grep -A3 "empirehq:" app/config/environments.ts | grep "region:" | sed "s/.*region: '\([^']*\)'.*/\1/")
            echo "      Region: $EMPIREHQ_REGION"
        else
            echo "   ❌ empirehq environment missing"
        fi
        
        if grep -q "rebecca:" app/config/environments.ts; then
            echo "   ✅ rebecca environment defined"
            REBECCA_REGION=$(grep -A3 "rebecca:" app/config/environments.ts | grep "region:" | sed "s/.*region: '\([^']*\)'.*/\1/")
            echo "      Region: $REBECCA_REGION"
        else
            echo "   ❌ rebecca environment missing"
        fi
    else
        echo "❌ environments.ts missing"
    fi
}

# Function to check deployment scripts
check_deployment_scripts() {
    echo ""
    echo "🚀 Checking deployment scripts..."
    
    if [[ -f "force-deploy.sh" ]] && [[ -x "force-deploy.sh" ]]; then
        echo "✅ force-deploy.sh exists and is executable"
    else
        echo "❌ force-deploy.sh missing or not executable"
    fi
    
    if [[ -f "deploy-all-regions.sh" ]] && [[ -x "deploy-all-regions.sh" ]]; then
        echo "✅ deploy-all-regions.sh exists and is executable"
    else
        echo "❌ deploy-all-regions.sh missing or not executable"
    fi
}

# Function to verify build setup
check_build_setup() {
    echo ""
    echo "🔨 Checking build configuration..."
    
    # Check if application builds
    echo "   Testing application build..."
    if npm run build > /dev/null 2>&1; then
        echo "   ✅ Application builds successfully"
    else
        echo "   ❌ Application build failed"
        return 1
    fi
    
    # Check if functions build
    echo "   Testing functions build..."
    cd functions
    if npm run build > /dev/null 2>&1; then
        echo "   ✅ Functions build successfully"
        cd ..
    else
        echo "   ❌ Functions build failed"
        cd ..
        return 1
    fi
}

# Function to show deployment URLs
show_deployment_info() {
    echo ""
    echo "📝 DEPLOYMENT INFORMATION"
    echo "========================"
    
    PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')
    
    echo ""
    echo "🌐 Expected Hosting URLs:"
    echo "• Rebecca Dashboard: https://rebecca-dashboard--$PROJECT_ID.web.app"
    echo "• Empire HQ: https://empirehq--$PROJECT_ID.web.app"
    echo ""
    echo "🔧 Expected Function URLs:"
    echo "• Europe West 4 (Rebecca): https://europe-west4-$PROJECT_ID.cloudfunctions.net"
    echo "• US Central 1 (Empire): https://us-central1-$PROJECT_ID.cloudfunctions.net"
    echo ""
    echo "🚀 To deploy run:"
    echo "• Force deploy all: ./force-deploy.sh"
    echo "• Standard deploy: ./deploy-all-regions.sh"
}

# Main execution
main() {
    check_config_files
    check_environment_config  
    check_deployment_scripts
    check_build_setup
    show_deployment_info
    
    echo ""
    echo "✅ Configuration verification complete!"
    echo ""
    echo "💡 Next steps:"
    echo "1. Ensure you're logged into Firebase: firebase login"
    echo "2. Run force deployment: ./force-deploy.sh"
    echo "3. Verify both targets are updated"
}

# Run the verification
main "$@"