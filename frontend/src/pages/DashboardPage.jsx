import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { EventContext } from '../context/EventContext';
import { Calendar, Building, Ticket } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const DashboardPage = () => {
  const { events } = useContext(EventContext);
  const [loading, setLoading] = useState(true);
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    // Simulate network delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Upcoming Events</h3>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><span className="loader"></span></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map(event => (
            <GlassCard key={event.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.25rem', lineHeight: '1.4' }}>{event.name}</h4>
              <div style={{ flex: 1 }}>
                <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <Building size={16} color="var(--primary)" /> {event.department}
                </p>
                <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar size={16} color="var(--primary)" /> {new Date(event.eventDateTime).toLocaleDateString()}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <Ticket size={16} color="var(--success)" /> ${event.ticketPrice.toFixed(2)}
                </p>
              </div>
              <Link to={`/event/${event.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>
                View & Book
              </Link>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
