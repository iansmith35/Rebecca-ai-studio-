#!/bin/bash

# Install Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    curl -sL https://firebase.tools | bash
    
    # Alternative method if the above doesn't work
    if ! command -v firebase &> /dev/null; then
        echo "Trying npm install method..."
        npm install -g firebase-tools
    fi
fi

echo "Firebase CLI version:"
firebase --version

echo "Firebase Functions setup complete!"
echo "To deploy functions:"
echo "1. cd functions"
echo "2. firebase login (if not already logged in)"
echo "3. firebase init (to set up your project)"
echo "4. firebase deploy --only functions"