# Legacy Google Apps Script Backend (ARCHIVED)

This directory contains the original Google Apps Script backend implementation that has been **replaced by Firebase Functions**.

## Migration Status
- ✅ Migrated to Firebase Functions in `/functions/` directory
- ✅ Frontend updated to use Firebase Functions
- ✅ All API endpoints maintained for compatibility

## Files Archived
- `Code.gs` - Original Apps Script backend code
- `appsscript.json` - Apps Script configuration
- `deploy.sh` - Deployment helper script
- `README.md` - Original documentation

## New Backend Location
The new Firebase Functions backend is located in `/functions/src/index.ts` and provides:
- 100% API compatibility with the original implementation
- Better error handling and logging
- TypeScript support
- Improved scalability and reliability
- Version control integration

## Deployment
The Firebase Functions backend is deployed using:
```bash
cd functions
firebase deploy --only functions
```

After deployment, update `lib/rebeccaConfig.ts` with the new function URL.

## Cleanup
This directory can be safely removed once the Firebase migration is fully tested and confirmed working.