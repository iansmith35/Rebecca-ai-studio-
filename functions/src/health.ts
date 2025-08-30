import * as functions from 'firebase-functions';

export const health = functions.https.onRequest((request, response) => {
  // Enable CORS for all origins
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (pre-flight)
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }
  
  // Return health status with region information
  response.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    projectId: process.env.GCLOUD_PROJECT,
    region: process.env.FUNCTION_REGION || 'unknown',
  });
});