// AdminRoute.js - Password protection with beautiful UI (Hint removed)
import React, { useState, useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('adminAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setError('');
    } else {
      setError('❌ Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (checking) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-loader"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-icon">👑</div>
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Enter credentials to access dashboard</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoFocus
              />
            </div>
            
            {error && <p className="login-error">{error}</p>}
            
            <button type="submit" className="login-btn">
              🔓 Access Dashboard
            </button>
          </form>
          
          {/* Hint paragraph REMOVED */}
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;