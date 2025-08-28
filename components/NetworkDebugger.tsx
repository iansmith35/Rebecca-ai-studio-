"use client";
import { REBECCA } from "@/lib/rebeccaConfig";
import { useState } from "react";

interface DebugResult {
  timestamp: string;
  success: boolean;
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  response?: any;
  error?: string;
  duration: number;
}

export default function NetworkDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [results, setResults] = useState<DebugResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: DebugResult) => {
    setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testEndpoint = async (url: string, method: string = 'GET', body?: any) => {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body && method === 'POST') {
        options.body = JSON.stringify(body);
      }

      console.log('🔍 Network Debug Test:', { url, method, body });
      
      const response = await fetch(url, options);
      const duration = performance.now() - startTime;
      
      let responseData: any;
      const contentType = response.headers.get('content-type') || '';
      
      try {
        if (contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (parseError) {
        responseData = `Failed to parse response: ${parseError}`;
      }

      addResult({
        timestamp,
        success: response.ok,
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        response: responseData,
        duration: Math.round(duration)
      });

    } catch (error) {
      const duration = performance.now() - startTime;
      
      addResult({
        timestamp,
        success: false,
        url,
        method,
        error: String(error),
        duration: Math.round(duration)
      });
    }
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    setResults([]);
    
    // Test sequence for comprehensive debugging
    const tests = [
      // 1. Test Firebase Functions directly (if configured)
      async () => {
        await testEndpoint(REBECCA.appsScriptURL, 'GET');
      },
      
      // 2. Test Firebase Functions health endpoint
      async () => {
        await testEndpoint(REBECCA.appsScriptURL, 'POST', { action: 'health' });
      },
      
      // 3. Test a typical data endpoint
      async () => {
        await testEndpoint(REBECCA.appsScriptURL, 'POST', { action: 'listEmails', max: 1 });
      },
      
      // 4. Test via the local proxy (if deployed)
      async () => {
        await testEndpoint('/api/rebecca', 'POST', { action: 'health' });
      }
    ];

    for (const test of tests) {
      try {
        await test();
        // Small delay between tests for readability
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Test failed:', error);
      }
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatResponse = (response: any): string => {
    if (typeof response === 'string') return response;
    return JSON.stringify(response, null, 2);
  };

  if (!isVisible) {
    return (
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
        <button 
          onClick={() => setIsVisible(true)}
          className="btn"
          style={{ 
            background: '#ff6b6b', 
            color: 'white',
            borderRadius: '50%',
            width: 50,
            height: 50,
            fontSize: 18
          }}
          title="Open Network Debugger"
        >
          🔍
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 1000,
      background: 'rgba(0,0,0,0.95)',
      border: '2px solid #00ff88',
      borderRadius: 8,
      padding: 20,
      width: '500px',
      maxHeight: '70vh',
      overflow: 'auto',
      fontSize: 12,
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <h3 style={{ color: '#00ff88', margin: 0 }}>🔍 Network Debugger</h3>
        <button onClick={() => setIsVisible(false)} className="btn" style={{ background: '#ff6b6b' }}>×</button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <p style={{ color: '#ccc', margin: '5px 0' }}>
          <strong>Backend URL:</strong> {REBECCA.appsScriptURL}
        </p>
        {REBECCA.appsScriptURL.includes('your-project-id') && (
          <p style={{ color: '#ff6b6b', margin: '5px 0', fontSize: 11 }}>
            ⚠️ Backend URL contains placeholder - Firebase Functions not deployed
          </p>
        )}
      </div>

      <div style={{ marginBottom: 15 }}>
        <button 
          onClick={runDiagnostics} 
          disabled={isLoading}
          className="btn"
          style={{ 
            background: isLoading ? '#666' : '#00ff88',
            color: isLoading ? '#ccc' : 'black',
            width: '100%'
          }}
        >
          {isLoading ? 'Running Tests...' : 'Run Network Diagnostics'}
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <h4 style={{ color: '#00ff88', marginBottom: 10 }}>📋 Debugging Instructions:</h4>
        <div style={{ color: '#ccc', fontSize: 11, lineHeight: 1.4 }}>
          <p>1. <strong>Open DevTools:</strong> Press F12 → Network tab</p>
          <p>2. <strong>Clear logs:</strong> Click the clear button in Network tab</p>
          <p>3. <strong>Run diagnostics:</strong> Click &quot;Run Network Diagnostics&quot; above</p>
          <p>4. <strong>Check results:</strong> Look for red entries in Network tab</p>
          <p>5. <strong>Inspect errors:</strong> Click on failed requests to see details</p>
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h4 style={{ color: '#00ff88', marginBottom: 10 }}>📊 Test Results:</h4>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {results.map((result, index) => (
              <div 
                key={index}
                style={{ 
                  border: `1px solid ${result.success ? '#00ff88' : '#ff6b6b'}`,
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 8,
                  background: result.success ? 'rgba(0,255,136,0.1)' : 'rgba(255,107,107,0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 5
                }}>
                  <span style={{ color: result.success ? '#00ff88' : '#ff6b6b' }}>
                    {result.success ? '✅' : '❌'} {result.method} {result.status || 'FAILED'}
                  </span>
                  <span style={{ color: '#999', fontSize: 10 }}>
                    {result.duration}ms
                  </span>
                </div>
                
                <div style={{ color: '#ccc', fontSize: 10, marginBottom: 5 }}>
                  <strong>URL:</strong> {result.url}
                </div>
                
                {result.error && (
                  <div style={{ color: '#ff6b6b', fontSize: 10, marginBottom: 5 }}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.response && (
                  <div style={{ marginTop: 5 }}>
                    <button
                      onClick={() => copyToClipboard(formatResponse(result.response))}
                      style={{ 
                        fontSize: 9, 
                        padding: '2px 6px', 
                        background: '#666', 
                        color: 'white',
                        border: 'none',
                        borderRadius: 2,
                        cursor: 'pointer',
                        marginBottom: 5
                      }}
                    >
                      Copy Response
                    </button>
                    <pre style={{ 
                      fontSize: 9, 
                      color: '#ccc', 
                      background: 'rgba(0,0,0,0.5)',
                      padding: 5,
                      borderRadius: 2,
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}>
                      {formatResponse(result.response)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}