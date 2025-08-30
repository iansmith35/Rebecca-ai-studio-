import { logApiCall, formatApiError } from './diagnostics';

// Improved API client with better error handling
export async function fetchFromBackend(endpoint: string, options: any = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  
  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_BACKEND_API_URL is not defined in environment variables');
    throw new Error('Backend URL not configured. Check your .env file.');
  }
  
  const url = `${apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    console.log(`🔄 Fetching from: ${url}`);
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
    return { 
      success: false, 
      message: formatApiError(error, process.env.NEXT_PUBLIC_BACKEND_API_URL),
      error 
    };
  }
}