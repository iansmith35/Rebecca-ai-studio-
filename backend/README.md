# Rebecca Backend - Google Apps Script

This directory contains the Google Apps Script backend code that powers the Rebecca AI Studio application.

## File Structure

- `Code.gs` - The main Google Apps Script file containing all backend functionality

## Deployment Instructions

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Replace the default `Code.gs` content with the content from `Code.gs` in this directory
4. Save the project with a meaningful name (e.g., "Rebecca Backend")

### Configure Web App Deployment

1. In the Apps Script editor, click on the "Deploy" button (top right)
2. Select "New deployment"
3. Choose "Web app" as the type
4. Set the following configuration:
   - Description: "Rebecca Backend API"
   - Execute as: "Me" (your account)
   - Who has access: "Anyone" (this is crucial for the frontend to access it)
5. Click "Deploy"
6. Copy the Web App URL (it should look like: `https://script.google.com/macros/s/AKfyc.../exec`)

### Update Frontend Configuration

After deploying, update the `appsScriptURL` in `/lib/rebeccaConfig.ts` with your new Web App URL.

## Required Permissions

The backend requires the following Google permissions:
- Gmail access (for email listing)
- Calendar access (for calendar events)
- Drive access (for file storage)
- Sheets access (for task and chat logging)

These permissions will be requested when you first run the deployment or access the Web App URL.

## API Endpoints

The backend supports the following actions via POST requests:

- `health` - Health check endpoint
- `listEmails` - List recent emails from Gmail
- `listCalendar` - List upcoming calendar events
- `listDrive` - List files from Drive (scope: 'ishe' or 'personal')
- `uploadFile` - Upload files to Drive
- `addTask` - Add tasks to the Heartbeat sheet
- `logChat` - Log chat conversations to the Memory sheet

## Configuration

The backend uses these constants (configured in `Code.gs`):
- `SHEET_ID` - Google Sheets ID for tasks and chat logging
- `HEARTBEAT_TAB` - Sheet tab name for tasks
- `MEMORY_TAB` - Sheet tab name for chat logs
- `DRIVE_ISHE` - Drive folder name for ISHE files
- `DRIVE_PERSONAL` - Drive folder name for personal files

## Testing

After deployment, you can test the backend by:
1. Visiting the Web App URL directly (should show authorization page)
2. Testing API calls from the frontend application
3. Using curl or Postman to test individual endpoints

## Troubleshooting

Common issues:
1. **"fetch failed" errors**: Check that the Web App is deployed with "Anyone" access
2. **Permission errors**: Visit the Web App URL to grant necessary permissions
3. **CORS errors**: Ensure the Web App is deployed with public access