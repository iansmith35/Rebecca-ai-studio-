# Admin Login with Google Cloud Secret Manager

This implementation adds secure admin authentication using Google Cloud Secret Manager to store the admin passcode.

## Features Added

- **Google Cloud Secret Manager Integration**: Securely stores admin passcode in GCP Secret Manager
- **Next.js API Route**: `/api/admin-login` endpoint for authentication
- **React Component**: `AdminLoginForm` with error handling and loading states
- **UI Integration**: Added to Personal Hub with option to switch between legacy PIN and Secret Manager authentication

## Files Created

1. **`lib/getAdminPasscode.ts`** - Utility to fetch admin passcode from Secret Manager
2. **`app/api/admin-login/route.ts`** - API endpoint for admin authentication
3. **`components/AdminLoginForm.tsx`** - React component for admin login form
4. **Updated `components/Panels.tsx`** - Integrated admin login into Personal Hub

## Setup Instructions

### 1. Configure Google Cloud Secret Manager

```bash
# Create a secret in Google Cloud Secret Manager
gcloud secrets create admin-passcode --data-file=- <<< "your-secure-passcode-here"

# Or via Google Cloud Console:
# - Go to Secret Manager in GCP Console
# - Create new secret named "admin-passcode"
# - Set the value to your desired admin passcode
```

### 2. Environment Variables

Ensure your project has the Google Cloud Project ID configured:

```bash
# In .env.local
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id

# Or set GOOGLE_CLOUD_PROJECT environment variable
GOOGLE_CLOUD_PROJECT=your-actual-project-id
```

### 3. Google Cloud Authentication

The app needs to authenticate with Google Cloud:

**For local development:**
```bash
gcloud auth application-default login
```

**For production (Cloud Run, App Engine, etc.):**
- The service account needs `Secret Manager Secret Accessor` role
- Or use Workload Identity for GKE

## Usage

1. Navigate to the **Personal Hub** section
2. Click **"Use Secret Manager Login"** button  
3. Enter your admin passcode (stored in Secret Manager)
4. Click **"Login"** to authenticate

## Security Notes

- Admin passcode is never exposed in frontend code
- Passcode is securely stored in Google Cloud Secret Manager
- API endpoint validates passcode server-side
- Form includes proper error handling and loading states
- Input field is properly typed as password

## Architecture

```
Frontend (AdminLoginForm) 
    ↓ POST request with passcode
API Route (/api/admin-login)
    ↓ Calls getAdminPasscode()
Google Cloud Secret Manager
    ↓ Returns stored passcode
API Route validates and responds
    ↓ Success/failure response
Frontend updates UI accordingly
```

## Error Handling

The system handles various error scenarios:
- Missing passcode input
- Invalid passcode
- Network errors
- Secret Manager configuration issues
- Server errors

## Fallback Option

The Personal Hub maintains the original PIN-based authentication as a fallback option, allowing users to switch between:
- **Secret Manager Login**: Secure, cloud-based authentication
- **Legacy PIN**: Original hardcoded PIN system (2338)