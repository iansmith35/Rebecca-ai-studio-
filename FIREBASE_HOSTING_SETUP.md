# Firebase Hosting Deployment Setup

## Overview

This repository now includes a GitHub Actions workflow that automatically deploys the Rebecca AI Studio frontend to Firebase Hosting whenever code is pushed to the `main` branch.

## Setup Instructions

### 1. Firebase Project Configuration

Update the `.firebaserc` file with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

Replace `your-firebase-project-id` with your real Firebase project ID.

### 2. GitHub Secrets Configuration

In your GitHub repository settings, you need to add the following secret:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add a new repository secret:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_REBECCA_DASHBORD`
   - **Value**: The complete JSON content of your Firebase service account key

### 3. Firebase Service Account Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the entire JSON content and paste it as the GitHub secret value

### 4. Project ID in Workflow

The workflow file (`.github/workflows/firebase-hosting-deploy.yml`) currently uses:
```yaml
projectId: rebecca-bot
```

Update this line to match your actual Firebase project ID if different.

## How It Works

1. **Trigger**: The workflow runs on every push to the `main` branch
2. **Build**: Runs `npm ci` and `npm run build` to create a static export
3. **Deploy**: Uses the official Firebase GitHub Action to deploy to Firebase Hosting
4. **Output**: Static files are served from Firebase Hosting CDN

## Frontend Configuration

The application has been configured for static export:
- Next.js config updated with `output: 'export'`
- Static files generated in `dist/` directory
- API routes removed (handled by Firebase Functions)
- Firebase Hosting serves from `dist/` directory

## Firebase Functions Integration

API calls are routed to Firebase Functions via the `firebase.json` configuration:
```json
"rewrites": [
  {
    "source": "/api/**",
    "function": "api"
  }
]
```

This means `/api/*` requests are handled by the Firebase Function deployed separately.

## Deployment Status

✅ **Ready for deployment** - Push to `main` branch to trigger automatic deployment to Firebase Hosting.

## Troubleshooting

- **Build fails**: Check that `npm run build` works locally
- **Deploy fails**: Verify Firebase service account has hosting deployment permissions
- **Wrong project**: Update both `.firebaserc` and the workflow `projectId` field
- **API not working**: Ensure Firebase Functions are deployed separately via `cd functions && firebase deploy --only functions`