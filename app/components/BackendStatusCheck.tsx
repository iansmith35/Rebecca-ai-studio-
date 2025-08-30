import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../utils/api-client';

export default function BackendStatusCheck() {
  const [status, setStatus] = useState<{ 
    loading: boolean; 
    success: boolean; 
    message: string; 
    error?: any 
  }>({ loading: true, success: false, message: 'Checking backend connection...' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await checkBackendHealth();
        setStatus({ loading: false, ...result });
      } catch (error) {
        setStatus({ 
          loading: false,
          success: false,
          message: 'Failed to check backend health',
          error
        });
      }
    };
    
    checkHealth();
  }, []);

  return (
    <div className="p-4 mb-4 rounded-lg border" style={{ 
      backgroundColor: status.loading ? '#f0f9ff' : (status.success ? '#f0fdf4' : '#fef2f2'),
      borderColor: status.loading ? '#bae6fd' : (status.success ? '#bbf7d0' : '#fecaca')
    }}>
      <h3 className="text-lg font-medium">
        {status.loading ? '⏳' : (status.success ? '✅' : '❌')} Backend Connection
      </h3>
      <p>{status.message}</p>
      
      {!status.success && !status.loading && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            API URL: {process.env.NEXT_PUBLIC_BACKEND_API_URL || 'Not configured'}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-500">Show debugging details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(status.error, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}