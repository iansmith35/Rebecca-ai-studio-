import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { REBECCA } from './rebeccaConfig';

const client = new SecretManagerServiceClient();

export async function getAdminPasscode(): Promise<string> {
  const projectId = REBECCA.firebase.projectId || process.env.GOOGLE_CLOUD_PROJECT;
  
  if (!projectId) {
    throw new Error('Google Cloud Project ID not configured. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT environment variable.');
  }

  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/admin-passcode/versions/latest`,
  });

  const payload = version.payload?.data?.toString();
  if (!payload) {
    throw new Error('Failed to retrieve admin passcode from Secret Manager');
  }

  return payload;
}