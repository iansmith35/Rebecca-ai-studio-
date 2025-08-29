import { useState } from "react";

interface AdminLoginFormProps {
  onAuthSuccess?: () => void;
}

export default function AdminLoginForm({ onAuthSuccess }: AdminLoginFormProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setError("");
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="neon" style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
        <h2 className="card-title">✅ Admin Access Granted</h2>
        <p className="small">You are now authenticated as an administrator.</p>
      </div>
    );
  }

  return (
    <div className="neon" style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h2 className="card-title">🔐 Admin Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="passcode" className="small" style={{ display: 'block', marginBottom: 8 }}>
            Admin Passcode
          </label>
          <input
            id="passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="input"
            placeholder="Enter admin passcode"
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div style={{ 
            marginBottom: 16, 
            padding: 12, 
            backgroundColor: 'rgba(255, 107, 107, 0.1)', 
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: 8,
            color: '#ff6b6b'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={isLoading || !passcode.trim()}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
}