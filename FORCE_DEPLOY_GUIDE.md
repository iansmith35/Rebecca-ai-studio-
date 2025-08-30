# Multi-Region Force Deployment Guide

## Overview

This guide explains how to use the multi-region force deployment system to ensure both deployment targets (`empirehq` and `rebecca-dashboard`) receive the latest code from PR #54.

## Problem Fixed

PR #54 introduced comprehensive environment configuration for multi-region deployments, but the deployment was only reaching one target (`empirehq`) and not the other (`rebecca-dashboard`). This force deployment system ensures both targets are updated simultaneously.

## Deployment Targets

| Target | Region | Function URL | Hosting URL |
|--------|--------|-------------|-------------|
| **rebecca-dashboard** | europe-west4 | `https://europe-west4-rebbeca-bot.cloudfunctions.net` | `https://rebecca-dashboard--rebbeca-bot.web.app` |
| **empirehq** | us-central1 | `https://us-central1-rebbeca-bot.cloudfunctions.net` | `https://empirehq--rebbeca-bot.web.app` |

## Environment Detection

The application automatically detects which environment it's running in based on the hostname:

- `empirehq.*` → Uses US Central 1 functions
- `rebecca-dashboard.*` → Uses Europe West 4 functions  
- `localhost` → Uses development environment

## Quick Start

### 1. Prerequisites

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 2. Force Deploy to Both Targets

```bash
# Make the script executable (if not already)
chmod +x force-deploy.sh

# Run force deployment
./force-deploy.sh
```

### 3. Verify Deployment

```bash
# Run verification tests
./verify-config.sh
./test-deployment.sh
```

## Scripts Available

### `force-deploy.sh`
Comprehensive deployment script that:
- Checks Firebase CLI availability 
- Verifies project configuration
- Builds application and functions
- Deploys to both regions with force flag
- Shows deployment URLs and status

### `deploy-all-regions.sh`
Simpler deployment script for standard deployments.

### `verify-config.sh`
Verifies all configuration files are correctly set up.

### `test-deployment.sh`
Runs comprehensive tests to validate deployment setup without actually deploying.

## Configuration Files

### `.firebaserc`
```json
{
  "projects": {
    "default": "rebbeca-bot"
  },
  "targets": {
    "rebbeca-bot": {
      "hosting": {
        "rebecca-dashboard": ["rebecca-dashboard--rebbeca-bot"],
        "empirehq": ["empirehq--rebbeca-bot"]
      }
    }
  }
}
```

### `firebase.json`
```json
{
  "hosting": [
    {
      "target": "rebecca-dashboard",
      "public": "dist",
      "rewrites": [{"source": "**", "destination": "/index.html"}]
    },
    {
      "target": "empirehq", 
      "public": "dist",
      "rewrites": [{"source": "**", "destination": "/index.html"}]
    }
  ],
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "predeploy": ["npm --prefix functions run build"]
    }
  ]
}
```

### `app/config/environments.ts`
```typescript
const environments = {
  empirehq: {
    name: 'Empire HQ',
    backendUrl: 'https://us-central1-rebbeca-bot.cloudfunctions.net',
    region: 'us-central1',
  },
  rebecca: {
    name: 'Rebecca Dashboard', 
    backendUrl: 'https://europe-west4-rebbeca-bot.cloudfunctions.net',
    region: 'europe-west4',
  }
};
```

## Troubleshooting

### Deployment Fails
1. Ensure you're logged into Firebase: `firebase login`
2. Check project permissions
3. Verify Firebase project ID is correct
4. Run `./verify-config.sh` to check configuration

### One Target Not Updating
1. Run force deployment: `./force-deploy.sh`
2. Check hosting target configuration in `.firebaserc`
3. Verify both targets are defined in `firebase.json`

### Functions Not Working
1. Check function deployment: `firebase functions:log`
2. Verify environment variables are set
3. Check Google Service Account configuration

## Success Indicators

After successful deployment, you should see:

✅ Both hosting URLs respond with the latest code  
✅ Environment detection works correctly on both sites  
✅ Functions are accessible from their respective regions  
✅ Backend routing matches the environment configuration  

## Next Steps

1. **Run Force Deployment**: `./force-deploy.sh`
2. **Test Both Sites**: Visit both hosting URLs and verify they show the latest changes
3. **Monitor Function Logs**: Check that backend calls are working correctly
4. **Cleanup**: Remove deployment verification indicators if no longer needed

## Support

If you encounter issues:
1. Run `./verify-config.sh` to check configuration
2. Run `./test-deployment.sh` to test without deploying
3. Check Firebase console for deployment status
4. Review function logs for API errors