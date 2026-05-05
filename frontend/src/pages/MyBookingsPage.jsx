import React from 'react';
import { useBookings } from '../context/BookingContext';
import { Calendar, Ticket, MapPin, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
  const { bookings } = useBookings();

  if (bookings.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Search size={64} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <h2 style={{ marginBottom: '1rem' }}>No Bookings Yet</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven't booked any tickets yet. Explore events and secure your spot!</p>
        <Link to="/" className="btn btn-primary">Browse Events</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Ticket color="var(--primary)" /> My Booked Tickets
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bookings.map((b) => (
          <GlassCard key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{b.event.name}</h4>
              <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <Calendar size={16} /> {new Date(b.event.eventDateTime).toLocaleString()}
              </p>
              <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <MapPin size={16} /> {b.event.venue}
              </p>
            </div>
            
            <div style={{ textAlign: 'right', flex: '1 1 150px' }}>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Booking #{b.id}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{b.numberOfTickets} Ticket(s)</p>
              <p style={{ color: 'var(--success)', fontWeight: 'bold', marginTop: '0.25rem' }}>${b.totalAmount.toFixed(2)} Paid</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
