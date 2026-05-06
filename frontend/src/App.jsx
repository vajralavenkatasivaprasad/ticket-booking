import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import BookingPage from './pages/BookingPage';
import SummaryPage from './pages/SummaryPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { EventProvider } from './context/EventContext';
import { BookingProvider } from './context/BookingContext';
import MyBookingsPage from './pages/MyBookingsPage';
import axios from 'axios';

axios.defaults.baseURL = 'https://ticket-booking-fadz.onrender.com';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { auth } = useContext(AuthContext);
  if (!auth) return <Navigate to="/login" replace />;
  if (requireAdmin && auth.role !== 'ROLE_ADMIN') return <Navigate to="/" replace />;
  return children;
};

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 100, 
      padding: '1.5rem 2rem', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(2, 6, 23, 0.7)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      marginBottom: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', background: 'linear-gradient(135deg, #8B5CF6, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
          Event Ticket Booking
        </h1>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Secure your spot at the most anticipated internal events</p>
      </div>

      {auth && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'relative' }}>
          <div style={{ position: 'relative', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onClick={() => { setShowDropdown(!showDropdown); markAllAsRead(); }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <Bell size={22} color="var(--text-main)" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'var(--error)', color: 'white', borderRadius: '50%', padding: '0.1rem 0.35rem', fontSize: '0.7rem', fontWeight: 'bold', border: '2px solid var(--bg-color)' }}>
                {unreadCount}
              </span>
            )}
          </div>

          {showDropdown && (
            <div style={{ position: 'absolute', top: '3.5rem', right: '0', width: '320px', background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(16px)', borderRadius: '1rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)', zIndex: 50, border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', maxHeight: '350px', overflowY: 'auto' }}>
              <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', fontSize: '1rem' }}>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No new notifications</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', borderLeft: !n.read ? '3px solid var(--primary)' : '3px solid transparent', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                    <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.4' }}>{n.message}</p>
                    <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{n.time.toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{auth.email.split('@')[0]}</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{auth.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}</span>
            </div>
            {auth.role === 'ROLE_ADMIN' ? (
              <Link to="/admin" className="text-primary" style={{ textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}>Admin Panel</Link>
            ) : (
              <Link to="/my-bookings" className="text-primary" style={{ textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}>My Bookings</Link>
            )}
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</button>
          </div>
        </div>
      )}
    </header>
  );
};

function AppRoutes() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="app-container">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/register" element={auth ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <EventProvider>
          <BookingProvider>
            <Router>
              <AppRoutes />
            </Router>
          </BookingProvider>
        </EventProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
