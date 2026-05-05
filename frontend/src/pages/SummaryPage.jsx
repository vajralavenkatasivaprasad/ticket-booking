import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Ticket, User, Briefcase } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <GlassCard style={{ textAlign: 'center' }}>
        <h2>No Booking Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go to Home
        </button>
      </GlassCard>
    );
  }

  const formattedDate = new Date(booking.event.eventDateTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <GlassCard style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p className="text-muted">Your tickets have been successfully booked.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Booking ID: <strong>#{booking.id}</strong></p>
      </GlassCard>

      <GlassCard>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          Booking Summary
        </h3>

        <div className="event-info-item">
          <Ticket className="event-info-icon" size={24} />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Event</p>
            <p style={{ fontWeight: '500' }}>{booking.event.name}</p>
          </div>
        </div>

        <div className="event-info-item">
          <Calendar className="event-info-icon" size={24} />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Date & Time</p>
            <p style={{ fontWeight: '500' }}>{formattedDate}</p>
          </div>
        </div>

        <div className="event-info-item">
          <MapPin className="event-info-icon" size={24} />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Venue</p>
            <p style={{ fontWeight: '500' }}>{booking.event.venue}</p>
          </div>
        </div>

        <div style={{ margin: '2rem 0', borderTop: '1px dashed var(--surface-light)' }}></div>

        <div className="event-info-item">
          <User className="event-info-icon" size={24} />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Attendee Name</p>
            <p style={{ fontWeight: '500' }}>{booking.userName}</p>
          </div>
        </div>

        <div className="event-info-item">
          <Briefcase className="event-info-icon" size={24} />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Department</p>
            <p style={{ fontWeight: '500' }}>{booking.department}</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1.5rem', 
          backgroundColor: 'var(--bg-color)', 
          borderRadius: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Tickets</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{booking.numberOfTickets}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Amount</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>
              ${booking.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--primary)', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.05)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Your Entry Pass</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>Scan this QR code at the entrance</p>
          <div style={{ padding: '1rem', background: 'white', display: 'inline-block', borderRadius: '0.5rem' }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ENTRY_PASS_${booking.id}_EVENT_${booking.event.id}_TICKETS_${booking.numberOfTickets}`} alt="Entry Pass QR" />
          </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '2rem' }}
        >
          Book Another Ticket
        </button>
      </GlassCard>
    </div>
  );
};

export default SummaryPage;
