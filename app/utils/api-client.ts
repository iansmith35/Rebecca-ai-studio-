import { logApiCall, formatApiError } from './diagnostics';
import { getConfig } from '../config/environments';

// Improved API client with better error handling and environment awareness
export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  // Get the environment-specific backend URL
  const config = getConfig();
  const apiUrl = config.backendUrl;
  
  if (!apiUrl) {
    console.error('❌ Backend URL is not defined for current environment');
    throw new Error('Backend URL not configured. Check environment configuration.');
  }
  
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    console.log(`🔄 Fetching from: ${url} (${config.name} environment)`);
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    
    // First check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      logApiCall(url, errorText);
      throw {
        status: response.status,
        message: `API Error ${response.status}: ${response.statusText}`,
        body: errorText
      };
    }
    
    // Try to parse as JSON
    try {
      const data = await response.json();
      logApiCall(url, data);
      return data;
    } catch (e) {
      // If it's not valid JSON, it might be HTML
      const text = await response.text();
      logApiCall(url, text);
      throw {
        status: response.status,
        message: 'Received non-JSON response',
        body: text
      };
    }
  } catch (error) {
    console.error('📛 API call failed:', error);
    throw error;
  }
}

// Health check function to test backend connectivity
export async function checkBackendHealth() {
  try {
    const result = await fetchFromBackend('/api/health');
    return { success: true, message: 'Connected to backend successfully!' };
  } catch (error) {
    const config = getConfig();
    return { 
      success: false, 
      message: formatApiError(error, config.backendUrl),
      error,
      environment: config.name,
      region: config.region
    };
  }
}