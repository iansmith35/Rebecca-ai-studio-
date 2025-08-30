// Utility to help diagnose backend connection issues
export function logApiCall(url: string, response: any) {
  console.log(`🔍 API call to: ${url}`);
  console.log('Response:', response);
  
  // Check if the response is HTML instead of JSON
  if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
    console.error('❌ Received HTML instead of JSON. Backend URL may be incorrect.');
  }
}

export function formatApiError(error: any, url?: string): string {
  if (error?.message?.includes('Failed to fetch')) {
    return `Cannot reach backend at ${url || 'configured URL'}. Please check your backend is running.`;
  }
  
  if (error?.status === 404) {
    return `Backend endpoint not found (404). Check if API route exists.`;
  }
  
  if (error?.status === 403) {
    return `Authentication error (403). Check your Firebase credentials.`;
  }
  
  return `Backend error: ${error?.message || JSON.stringify(error)}`;
}
