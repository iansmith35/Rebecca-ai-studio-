# Firebase Functions Backend

This directory contains the Firebase Functions backend that replaces the Google Apps Script implementation.

## Prerequisites

### Install Firebase CLI

**Option 1 - NPM (Recommended):**
```bash
npm install -g firebase-tools
```

**Option 2 - Direct Download:**
```bash
curl -sL https://firebase.tools | bash
```

**Option 3 - Using the setup script:**
```bash
# From the root directory
./setup-firebase.sh
```

## Quick Setup Guide

### 1. Login to Firebase
```bash
firebase login
```

### 2. Create/Select Firebase Project
Go to [Firebase Console](https://console.firebase.google.com/) and create a new project or use existing one.

### 3. Initialize Firebase in Your Project
From the repository root directory:
```bash
firebase init functions
```
- Select "Use an existing project" and choose your Firebase project
- Select TypeScript
- Use ESLint: No (we have our own setup)
- Install dependencies: Yes (will install in functions directory)

### 4. Update Project Configuration
Edit `.firebaserc` in the root directory:
```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 5. Set Up Google Service Account (Required)

The functions need a Google Service Account to access Gmail, Calendar, Drive, and Sheets APIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Enable required APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - Google Sheets API
4. Create Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Download the JSON key file
5. Set the credentials as Firebase environment variable:
   ```bash
   firebase functions:config:set google.credentials="$(cat path/to/service-account.json)"
   ```

### 6. Deploy Functions
From the repository root:
```bash
cd functions
firebase deploy --only functions
```

Or using npm scripts:
```bash
npm run functions:deploy
```

## Local Development

### Install Dependencies
```bash
cd functions
npm install
```

### Build Functions
```bash
npm run build
# or from root: npm run functions:build
```

### Run Firebase Emulator (Local Testing)
```bash
npm run serve
# or from root: npm run functions:serve
```

This will start the Firebase Functions emulator, typically at `http://localhost:5001`

## Configuration

### Environment Variables

Set up your Google Sheets ID and Drive folder names:
```bash
firebase functions:config:set \
  google.sheet_id="1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY" \
  google.drive_folder_ishe="ISHE_Uploads" \
  google.drive_folder_personal="Personal_Uploads"
```

View current config:
```bash
firebase functions:config:get
```

### Service Account Permissions

Ensure your service account has the following permissions:
- Gmail: Read access to mailbox
- Calendar: Read access to primary calendar  
- Drive: Full access to create folders and files
- Sheets: Read/write access to the specified spreadsheet

## API Endpoints

After deployment, your functions will be available at:
`https://[region]-[project-id].cloudfunctions.net/api`

The API supports all the same endpoints as the original Google Apps Script:

### POST /api with JSON body:
- `{action: "health"}` - Health check
- `{action: "listEmails", max: 10}` - List recent emails
- `{action: "listCalendar", max: 10}` - List upcoming events
- `{action: "listDrive", scope: "ishe|personal", max: 25}` - List files
- `{action: "uploadFile", base64: "...", filename: "...", scope: "ishe|personal"}` - Upload file
- `{action: "addTask", text: "Task description"}` - Add task
- `{action: "listTasks"}` - List all tasks
- `{action: "completeTask", id: "task_id"}` - Complete task
- `{action: "logChat", userText: "...", botText: "..."}` - Log conversation

## Updating Frontend

After deployment, update `/lib/rebeccaConfig.ts`:

```typescript
export const REBECCA = {
  // ... other config
  appsScriptURL: "https://[region]-[project-id].cloudfunctions.net/api",
  // ... rest of config
};
```

Replace `[region]` and `[project-id]` with your actual Firebase project values.

## Troubleshooting

### Common Issues

1. **"Firebase command not found"**
   ```bash
   npm install -g firebase-tools
   # or restart your terminal
   ```

2. **"Function deployment failed"**
   - Check that you're logged in: `firebase login`
   - Verify project ID in `.firebaserc`
   - Check build errors: `npm run build`

3. **"Service account not configured"**
   - Ensure you've set up the service account JSON
   - Verify config: `firebase functions:config:get`

4. **"API permission errors"**
   - Check that required Google APIs are enabled
   - Verify service account has proper permissions
   - Make sure the service account key is valid

### Debugging

View function logs:
```bash
firebase functions:log --only api
```

Stream logs in real-time:
```bash
firebase functions:log --only api --follow
```

## Migration from Google Apps Script

This Firebase Functions implementation provides 100% API compatibility with the original Google Apps Script backend. No frontend changes are required except updating the `appsScriptURL` configuration.

### Key Benefits of Migration:
- Better error handling and logging
- TypeScript support with type safety
- Version control and CI/CD integration
- More reliable scaling and performance
- Better debugging and monitoring tools
- No quota limitations of Google Apps Script

The functions will handle the same requests and return the same response format as the original implementation.