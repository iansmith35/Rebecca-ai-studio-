<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1H1vvoWNk7J_5MylnGRHIrdekBnnt8ryW

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `NEXT_PUBLIC_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Deploy the backend (see Backend Setup section below)
4. Run the app:
   `npm run dev`

## Backend Setup

The Rebecca AI Studio requires a Google Apps Script backend to handle Gmail, Calendar, and Drive integration.

### Quick Setup
1. Follow the instructions in [`backend/README.md`](backend/README.md) to deploy the Google Apps Script
2. Update the `appsScriptURL` in [`lib/rebeccaConfig.ts`](lib/rebeccaConfig.ts) with your deployed Web App URL
3. Visit the Web App URL to authorize the required permissions

### What the backend provides
- Gmail integration (list recent emails)
- Calendar integration (list upcoming events)  
- Google Drive integration (file upload/listing)
- Google Sheets integration (task logging and chat history)

For detailed deployment instructions, see [`backend/README.md`](backend/README.md).
