#!/bin/bash

echo "Building application..."
npm run build

echo "Deploying to all regions..."
firebase deploy --only hosting:rebecca-dashboard,functions:europe-west4
firebase deploy --only hosting:empirehq,functions:us-central1

echo "Deployment complete!"