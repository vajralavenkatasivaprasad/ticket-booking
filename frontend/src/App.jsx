import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import SummaryPage from './pages/SummaryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="app-container">
      <header style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #4F46E5, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Event Ticket Booking
        </h1>
        <p className="text-muted">Secure your spot at the most anticipated internal events</p>
      </header>
      
      <main className="container">
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/register" element={auth ? <Navigate to="/" replace /> : <RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><SummaryPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
