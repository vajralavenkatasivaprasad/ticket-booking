import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ROLE_USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setSuccess('Registration successful! Please login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Register</h2>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-input" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>
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
        <div className="form-group">
          <label className="form-label">Role</label>
          <select 
            className="form-input" 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="ROLE_USER">User</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }} className="text-muted">
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
