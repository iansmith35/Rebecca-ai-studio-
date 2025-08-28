# 🔧 Frontend API Configuration Guide

## ✅ COMPLETED FIXES

### Issue Fixed
- [x] **Missing API endpoint configuration**: Frontend was calling `/api/rebecca` but no API route existed
- [x] **Static export incompatibility**: API routes don't work with `output: 'export'` 
- [x] **Frontend now calls backend directly**: Updated all components to call external backend URL
- [x] **Environment configuration**: Created `.env.local` with proper backend URL format
- [x] **TextMagic API integration**: Updated to call TextMagic API directly with credentials

### Changes Made
- [x] Created `.env.local` with Cloud Run backend URL format
- [x] Updated all components to use `REBECCA.appsScriptURL` instead of `/api/rebecca`
- [x] Modified TextMagic component to call TextMagic API directly
- [x] Updated page header links to point to actual backend
- [x] Verified build works with all changes

## 🚀 DEPLOYMENT STEPS

### 1. Update Backend URL
In `.env.local`, replace the placeholder URL:
```bash
# Replace 'xxxxxxx' with your actual deployed backend hash
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://rebecca-dashbord-xxxxxxx.eu-west4.run.app
```

### 2. Alternative Backend URLs
If your backend is deployed elsewhere:
```bash
# Firebase Functions
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net/api

# Custom domain  
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://api.yourdomain.com

# Other Cloud Run deployment
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://your-service-hash.region.run.app
```

### 3. Verify Backend Connectivity
1. Update the URL in `.env.local`
2. Run `npm run build` to test the build
3. Deploy the frontend
4. Check the "Health" link in the app header points to your backend
5. Test API functionality (tasks, email lists, etc.)

### 4. CORS Configuration
Ensure your backend allows requests from your frontend domain:
- Production domain: `https://your-frontend-domain.com`
- Development: `http://localhost:3000`

## 🔍 TESTING

### Build Test
```bash
npm run build
```
Should complete without errors.

### Development Test
```bash
npm run dev
```
Visit http://localhost:3000 and:
1. Click "Health" link - should open your backend
2. Try adding a task - should call your backend
3. Check browser network tab for API calls to your backend URL

### Production Test
After deployment:
1. Open browser dev tools
2. Check that API calls go to your backend URL (not localhost)
3. Verify no 404 errors for `/api/rebecca` calls
4. Test all functionality works with deployed backend

## 📝 CONFIGURATION REFERENCE

The app uses these environment variables:
- `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL` - Main backend API URL  
- `NEXT_PUBLIC_API_KEY` - Gemini API key for chat
- `NEXT_PUBLIC_FIREBASE_*` - Firebase config (if using Firebase)

All components now call `REBECCA.appsScriptURL` which reads from `NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL`.

## ✅ VERIFICATION CHECKLIST

- [ ] Updated `.env.local` with correct backend URL
- [ ] `npm run build` succeeds without errors
- [ ] Deployed frontend can reach backend (no CORS errors)
- [ ] "Health" link opens backend successfully  
- [ ] API calls in browser dev tools point to correct backend URL
- [ ] All app functionality works (tasks, email, calendar, etc.)