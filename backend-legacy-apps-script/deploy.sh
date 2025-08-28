#!/bin/bash

# Rebecca Backend Deployment Script
# This script helps with deploying the Google Apps Script backend

echo "Rebecca Backend Deployment Helper"
echo "=================================="
echo ""
echo "To deploy the backend:"
echo "1. Install clasp (Google Apps Script CLI): npm install -g @google/clasp"
echo "2. Login to clasp: clasp login"
echo "3. Create new project: clasp create --type webapp --title 'Rebecca Backend'"
echo "4. Push the code: clasp push"
echo "5. Deploy as web app: clasp deploy --description 'Rebecca Backend API'"
echo ""
echo "Alternatively, you can manually deploy by:"
echo "1. Going to https://script.google.com/"
echo "2. Creating a new project"
echo "3. Copying the contents of Code.gs and appsscript.json"
echo "4. Deploying as a web app with 'Anyone' access"
echo ""
echo "After deployment, update lib/rebeccaConfig.ts with the new Web App URL"