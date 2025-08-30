// Environment configurations
type EnvironmentConfig = {
  name: string;
  backendUrl: string;
  region: string;
}

// Environment detection based on hostname
export function getCurrentEnvironment(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('empirehq')) return 'empirehq';
    if (hostname.includes('rebecca-dashboard')) return 'rebecca';
    
    // Local development
    return 'development';
  }
  
  // Server-side rendering default
  return process.env.NEXT_PUBLIC_DEFAULT_ENVIRONMENT || 'development';
}

// Environment-specific configurations
const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5001',
    region: 'local',
  },
  empirehq: {
    name: 'Empire HQ',
    backendUrl: 'https://us-central1-rebbeca-bot.cloudfunctions.net',
    region: 'us-central1',
  },
  rebecca: {
    name: 'Rebecca Dashboard',
    backendUrl: 'https://europe-west4-rebbeca-bot.cloudfunctions.net',
    region: 'europe-west4',
  },
};

export function getConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
}