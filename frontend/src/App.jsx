import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import BookingPage from './pages/BookingPage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './components/Chatbot';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

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
    <header style={{ padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #4F46E5, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Event Ticket Booking
        </h1>
        <p className="text-muted">Secure your spot at the most anticipated internal events</p>
      </div>

      {auth && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setShowDropdown(!showDropdown); markAllAsRead(); }}>
            <Bell size={24} color="var(--text-color)" />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--error)', color: 'white', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {unreadCount}
              </span>
            )}
          </div>

          {showDropdown && (
            <div style={{ position: 'absolute', top: '3rem', right: '0', width: '300px', backgroundColor: 'var(--surface)', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', zIndex: 50, border: '1px solid var(--surface-light)', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--surface-light)', paddingBottom: '0.5rem' }}>Notifications</h4>
              {notifications.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>No notifications</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'var(--surface-light)', borderRadius: '0.25rem' }}>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>{n.message}</p>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{n.time.toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>{auth.email}</span>
            {auth.role === 'ROLE_ADMIN' && <Link to="/admin" className="text-primary" style={{ textDecoration: 'none' }}>Admin Panel</Link>}
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
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
          <Route path="/login" element={auth ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={auth ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
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
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
