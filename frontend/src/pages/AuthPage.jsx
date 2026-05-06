import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Shield, Check, X, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'ROLE_USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Real-time validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Real-time validation effects
  useEffect(() => {
    // Password strength logic
    if (!isLogin && formData.password) {
      let strength = 0;
      if (formData.password.length >= 6) strength += 25;
      if (formData.password.match(/[A-Z]/)) strength += 25;
      if (formData.password.match(/[0-9]/)) strength += 25;
      if (formData.password.match(/[^A-Za-z0-9]/)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }

    // Passwords match logic
    if (!isLogin && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }

    // Email basic syntax logic
    if (formData.email) {
      setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
    } else {
      setEmailValid(true);
    }
  }, [formData, isLogin]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'ROLE_USER' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isLogin && !passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        login(response.data.token);
        navigate('/');
      } else {
        await axios.post('/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        setSuccess('Registration successful! Switching to login...');
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ ...formData, password: '', confirmPassword: '' });
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setIsLoading(false);
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
      setFormData({ ...formData, email: resetEmail, password: '' });
    } catch (err) {
      setResetError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      perspective: '1000px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        transform: isLogin ? 'rotateY(0deg)' : 'rotateY(0deg)' // Changed from 3D flip to crossfade for better UX with forms
      }}>
        
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Animated Background Gradients */}
          <div style={{
            position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
            background: `radial-gradient(circle at ${isLogin ? '30% 30%' : '70% 70%'}, rgba(139, 92, 246, 0.15), transparent 40%),
                         radial-gradient(circle at ${isLogin ? '70% 70%' : '30% 30%'}, rgba(16, 185, 129, 0.1), transparent 40%)`,
            transition: 'all 1s ease',
            zIndex: 0,
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                display: 'inline-flex',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '0.25rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={{
                    background: isLogin ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: isLogin ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px',
                    fontWeight: isLogin ? '600' : '400', cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: isLogin ? '0 4px 12px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={{
                    background: !isLogin ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                    color: !isLogin ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px',
                    fontWeight: !isLogin ? '600' : '400', cursor: 'pointer', transition: 'all 0.3s ease',
                    boxShadow: !isLogin ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                  }}
                >
                  Register
                </button>
              </div>
              <h2 style={{ 
                fontSize: '2rem', margin: 0, 
                background: isLogin ? 'linear-gradient(135deg, #fff, #a78bfa)' : 'linear-gradient(135deg, #fff, #6ee7b7)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                transition: 'all 0.5s ease'
              }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {isLogin ? 'Enter your credentials to access your account' : 'Join us to start booking events'}
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', animation: 'fadeIn 0.3s ease' }}>
                <X size={16} /> {error}
              </div>
            )}
            
            {success && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', animation: 'fadeIn 0.3s ease' }}>
                <Check size={16} /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {!isLogin && (
                <div style={{ animation: 'slideDown 0.4s ease forwards', opacity: 0, transform: 'translateY(-10px)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input 
                      type="text" name="name" 
                      value={formData.name} onChange={handleInputChange} 
                      required={!isLogin} placeholder="John Doe"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  Email Address
                  {!emailValid && formData.email && <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>Invalid format</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: formData.email ? (emailValid ? '#6ee7b7' : '#fca5a5') : 'rgba(255,255,255,0.4)' }} />
                  <input 
                    type="email" name="email" 
                    value={formData.email} onChange={handleInputChange} 
                    required placeholder="you@example.com"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: `1px solid ${formData.email && !emailValid ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = isLogin ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'}
                    onBlur={(e) => !emailValid ? e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)' : e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  Password
                  {isLogin && (
                    <button type="button" onClick={() => setShowForgotModal(true)} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
                      Forgot?
                    </button>
                  )}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input 
                    type="password" name="password" 
                    value={formData.password} onChange={handleInputChange} 
                    required placeholder="••••••••"
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s' }}
                    onFocus={(e) => e.target.style.borderColor = isLogin ? 'rgba(139, 92, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                
                {/* Real-time Password Strength Meter */}
                {!isLogin && formData.password && (
                  <div style={{ marginTop: '0.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Password strength</span>
                      <span style={{ fontSize: '0.7rem', color: passwordStrength < 50 ? '#fca5a5' : passwordStrength < 75 ? '#fcd34d' : '#6ee7b7' }}>
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${passwordStrength}%`, 
                        background: passwordStrength < 50 ? '#ef4444' : passwordStrength < 75 ? '#f59e0b' : '#10b981',
                        transition: 'all 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div style={{ animation: 'slideDown 0.5s ease forwards', opacity: 0, transform: 'translateY(-10px)' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                    Confirm Password
                    {!passwordsMatch && formData.confirmPassword && <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>Doesn't match</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: formData.confirmPassword ? (passwordsMatch ? '#6ee7b7' : '#fca5a5') : 'rgba(255,255,255,0.4)' }} />
                    <input 
                      type="password" name="confirmPassword" 
                      value={formData.confirmPassword} onChange={handleInputChange} 
                      required={!isLogin} placeholder="••••••••"
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: `1px solid ${formData.confirmPassword && !passwordsMatch ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(16, 185, 129, 0.5)'}
                      onBlur={(e) => !passwordsMatch ? e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)' : e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div style={{ animation: 'slideDown 0.6s ease forwards', opacity: 0, transform: 'translateY(-10px)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Account Type</label>
                  <select 
                    name="role" value={formData.role} onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  >
                    <option value="ROLE_USER" style={{ background: '#1e293b' }}>Regular User</option>
                    <option value="ROLE_ADMIN" style={{ background: '#1e293b' }}>Administrator</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading || (!isLogin && (!passwordsMatch || passwordStrength < 50)) || !emailValid}
                style={{ 
                  marginTop: '1rem',
                  padding: '0.875rem', 
                  borderRadius: '10px',
                  background: isLogin ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'linear-gradient(135deg, #10B981, #059669)',
                  color: '#fff', fontSize: '1rem', fontWeight: '600', 
                  border: 'none', cursor: (isLoading || !emailValid || (!isLogin && (!passwordsMatch || passwordStrength < 50))) ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                  boxShadow: isLogin ? '0 10px 20px -10px rgba(139, 92, 246, 0.5)' : '0 10px 20px -10px rgba(16, 185, 129, 0.5)',
                  transition: 'all 0.3s ease',
                  opacity: (isLoading || !emailValid || (!isLogin && (!passwordsMatch || passwordStrength < 50))) ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Internal CSS for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Reset Password</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Enter your email address and we will email you a newly generated password.
            </p>
            
            <form onSubmit={handleForgotPassword}>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              
              {resetError && <div style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>{resetError}</div>}
              {resetMessage && <div style={{ color: '#6ee7b7', marginBottom: '1rem', fontSize: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>{resetMessage}</div>}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowForgotModal(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}>
                  {resetMessage ? 'Close' : 'Cancel'}
                </button>
                {!resetMessage && (
                  <button type="submit" disabled={isResetting} style={{ flex: 1, padding: '0.75rem', background: '#8B5CF6', border: 'none', color: '#fff', borderRadius: '10px', cursor: isResetting ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center' }}>
                    {isResetting ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> : 'Reset Password'}
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

export default AuthPage;
