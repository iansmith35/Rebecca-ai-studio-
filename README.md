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
3. **Optional:** Set the `NEXT_PUBLIC_OPENAI_API_KEY` in [.env.local](.env.local) for OpenAI fallback support
4. Deploy the backend (see Backend Setup section below)
5. Run the app:
   `npm run dev`

### OpenAI API Fallback

To use OpenAI as a fallback AI provider, set your OpenAI API key in `.env.local`:

```
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
```

**How it works:**
- The app will use Gemini as the primary AI provider
- If Gemini fails, it will automatically fall back to OpenAI
- You can see which provider is active in the chat interface
- Get your OpenAI API key from: https://platform.openai.com/account/api-keys

**Benefits:**
- Improved reliability - if one provider is down, the other takes over
- Zero downtime for AI features
- Automatic fallback without user intervention

## Backend Setup

The Rebecca AI Studio supports two backend options for handling Gmail, Calendar, and Drive integration:

### Option 1: Firebase Functions (Recommended)

**Modern, scalable backend with TypeScript support**

1. Follow the instructions in [`functions/README.md`](functions/README.md) to deploy Firebase Functions
2. Update the `appsScriptURL` in [`lib/rebeccaConfig.ts`](lib/rebeccaConfig.ts) with your Firebase Functions URL
3. Set up Google Service Account for API access (see functions README)

Quick deployment:
```bash
cd functions
firebase deploy --only functions
```

### Option 2: Google Apps Script (Legacy)

**Traditional Google Apps Script backend**

1. Follow the instructions in [`backend/README.md`](backend/README.md) to deploy the Google Apps Script
2. Update the `appsScriptURL` in [`lib/rebeccaConfig.ts`](lib/rebeccaConfig.ts) with your deployed Web App URL
3. Visit the Web App URL to authorize the required permissions

### What the backend provides
- Gmail integration (list recent emails)
- Calendar integration (list upcoming events)  
- Google Drive integration (file upload/listing)
- Google Sheets integration (task logging and chat history)

For detailed deployment instructions, see [`functions/README.md`](functions/README.md) or [`backend/README.md`](backend/README.md).

## Development Workflow

This repository follows a structured git workflow for clean development and deployment. See [GIT_WORKFLOW.md](GIT_WORKFLOW.md) for complete instructions.

### Quick Start

**Create a new feature:**
```bash
./create-feature-branch.sh "your-feature-description"
# Make your changes
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-description
# Create PR on GitHub
```

**After PR merge:**
```bash
./cleanup-branch.sh feature/your-feature-description
```

**Validate your workflow:**
```bash
./validate-workflow.sh
```

This ensures each PR gets a unique number and maintains clean git history.
