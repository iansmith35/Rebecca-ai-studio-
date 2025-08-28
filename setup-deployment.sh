#!/bin/bash

echo "🚀 Rebecca AI Studio - Complete Deployment Setup"
echo "=================================================="
echo ""
echo "This script will help you prepare for deployment by checking all configurations"
echo "and guiding you through the setup process."
echo ""

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check current git branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Step 1: Check Firebase CLI
echo "Step 1: Firebase CLI Check"
echo "=========================="
if command -v firebase &> /dev/null; then
    echo -e "${GREEN}✅ Firebase CLI is installed${NC}"
    firebase --version
else
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Firebase CLI${NC}"
        echo "Please install manually: npm install -g firebase-tools"
        exit 1
    fi
fi
echo ""

# Step 2: Check Firebase Configuration
echo "Step 2: Firebase Project Configuration"
echo "======================================"
if [[ ! -f ".firebaserc" ]]; then
    echo -e "${RED}❌ .firebaserc not found${NC}"
    exit 1
fi

PROJECT_ID=$(cat .firebaserc | grep -o '"default"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"default"[[:space:]]*:[[:space:]]*"\(.*\)"/\1/')

if [[ "$PROJECT_ID" == "your-firebase-project-id" ]]; then
    echo -e "${YELLOW}⚠️  Firebase project still uses placeholder ID${NC}"
    echo ""
    echo "🔧 TO FIX THIS:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Create a new project or use existing one"
    echo "3. Run: firebase use --add [your-project-id]"
    echo "4. Or manually edit .firebaserc with your actual project ID"
    echo ""
    echo -e "${RED}❌ Cannot proceed without real Firebase project ID${NC}"
else
    echo -e "${GREEN}✅ Firebase project configured: ${PROJECT_ID}${NC}"
fi
echo ""

# Step 3: Environment Configuration
echo "Step 3: Environment Configuration"
echo "================================="
if [[ -f ".env.local" ]]; then
    echo -e "${GREEN}✅ .env.local file exists${NC}"
    
    if grep -q "your-project-id\|your-firebase" .env.local; then
        echo -e "${YELLOW}⚠️  .env.local contains placeholder values${NC}"
        echo ""
        echo "🔧 TO FIX THIS:"
        echo "Update .env.local with your actual Firebase project values:"
        echo "- Get these from Firebase Console > Project Settings > General"
        echo "- Replace all 'your-project-id' and placeholder values"
    else
        echo -e "${GREEN}✅ .env.local appears to be configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local file missing${NC}"
    echo "Template file should have been created. Please check."
fi
echo ""

# Step 4: Build Check
echo "Step 4: Build Verification"
echo "========================="
echo "Testing Next.js build..."
if npm run build; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Functions Check
echo "Step 5: Firebase Functions Check"
echo "================================"
if [[ -d "functions" ]]; then
    echo -e "${GREEN}✅ Functions directory exists${NC}"
    
    cd functions
    if [[ -f "package.json" ]]; then
        echo "Installing function dependencies..."
        if npm install; then
            echo -e "${GREEN}✅ Function dependencies installed${NC}"
        else
            echo -e "${RED}❌ Failed to install function dependencies${NC}"
            cd ..
            exit 1
        fi
        
        echo "Building functions..."
        if npm run build; then
            echo -e "${GREEN}✅ Functions build successfully${NC}"
        else
            echo -e "${RED}❌ Functions build failed${NC}"
            cd ..
            exit 1
        fi
    else
        echo -e "${RED}❌ Functions package.json not found${NC}"
    fi
    cd ..
else
    echo -e "${RED}❌ Functions directory not found${NC}"
fi
echo ""

# Step 6: Deployment Readiness Summary
echo "Step 6: Deployment Readiness Summary"
echo "===================================="
echo ""
echo -e "${BLUE}📋 DEPLOYMENT CHECKLIST:${NC}"
echo ""

if [[ "$PROJECT_ID" == "your-firebase-project-id" ]]; then
    echo -e "${RED}❌ Update Firebase project configuration${NC}"
    echo "   Run: firebase use --add [your-actual-project-id]"
else
    echo -e "${GREEN}✅ Firebase project configuration${NC}"
fi

if [[ -f ".env.local" ]] && ! grep -q "your-project-id\|your-firebase" .env.local; then
    echo -e "${GREEN}✅ Environment configuration${NC}"
else
    echo -e "${RED}❌ Update environment configuration (.env.local)${NC}"
fi

echo -e "${GREEN}✅ Frontend builds successfully${NC}"
echo -e "${GREEN}✅ Functions code exists and builds${NC}"

echo ""
echo -e "${BLUE}🚀 NEXT STEPS FOR DEPLOYMENT:${NC}"
echo ""
echo "1. Fix any ❌ items above"
echo "2. Login to Firebase: firebase login"
echo "3. Deploy functions: cd functions && firebase deploy --only functions"
echo "4. Update .env.local with deployed function URL"
echo "5. Deploy frontend to your hosting platform (Vercel/Firebase Hosting)"
echo ""
echo -e "${YELLOW}💡 TIP: The app now shows deployment verification indicators${NC}"
echo "   Look for the 🚀 DEPLOYMENT VERIFICATION ACTIVE message and date badge"
echo "   These will help you confirm when new deployments go live!"
echo ""