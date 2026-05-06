import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('Please enter your email');
      return;
    }
    
    setIsResetting(true);
    setResetError('');
    setResetMessage('');
    
    try {
      const response = await axios.post('/api/auth/reset-password', { email: resetEmail });
      setResetMessage(response.data.message);
      // Keep the email prefilled, but clear the password field since the user needs to enter the random password they received
      setFormData({ ...formData, email: resetEmail, password: '' });
    } catch (err) {
      setResetError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Login</h2>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button type="button" onClick={() => setShowResetModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}>
            Forgot Password?
          </button>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }} className="text-muted">
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register here</Link>
      </p>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem' }}>Reset Password</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Enter your email address and we will email you a newly generated password.
            </p>
            
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Enter your email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                />
              </div>
              
              {resetError && <p className="text-error" style={{ marginBottom: '1rem' }}>{resetError}</p>}
              {resetMessage && <p style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: 'bold' }}>{resetMessage}</p>}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowResetModal(false)}>
                  {resetMessage ? 'Close' : 'Cancel'}
                </button>
                {!resetMessage && (
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isResetting}>
                    {isResetting ? <span className="loader"></span> : 'Reset Password'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
