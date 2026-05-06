import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { EventContext } from '../context/EventContext';
import { PlusCircle, Calendar, Users, Ticket } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const { events, addEvent, fetchEvents } = useContext(EventContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    }
  }, [events.length, fetchEvents]);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    eventDateTime: '',
    venue: '',
    ticketPrice: 0,
    totalTickets: 100
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const newEvent = {
        name: formData.name,
        department: formData.department,
        eventDateTime: new Date(formData.eventDateTime).toISOString(),
        venue: formData.venue,
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets)
      };

      await addEvent(newEvent);

      setSuccess('Event created successfully!');
      addNotification(`Admin Action: Created new event "${formData.name}"`);
      setFormData({
        name: '', department: '', eventDateTime: '', venue: '', ticketPrice: 0, totalTickets: 100
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create event. Ensure backend is running and you have Admin rights.');
    } finally {
      setLoading(false);
    }
  };

  if (auth?.role !== 'ROLE_ADMIN') {
    return <h2>Unauthorized. Admins only.</h2>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <PlusCircle size={32} color="var(--primary)" />
        <h2>Admin Dashboard - Create Event</h2>
      </div>

      <GlassCard>
        {success && <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '0.5rem', marginBottom: '1rem' }}>{success}</div>}
        {error && <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Event Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Date & Time</label>
              <input type="datetime-local" name="eventDateTime" className="form-input" value={formData.eventDateTime} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Venue</label>
              <input type="text" name="venue" className="form-input" value={formData.venue} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Ticket Price ($)</label>
              <input type="number" name="ticketPrice" className="form-input" min="0" step="0.01" value={formData.ticketPrice} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Total Tickets Capacity</label>
              <input type="number" name="totalTickets" className="form-input" min="1" value={formData.totalTickets} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? <span className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span> : 'Create Event'}
          </button>
        </form>
      </GlassCard>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar color="var(--primary)" /> Manage Events
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((ev) => (
            <GlassCard key={ev.id} style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ev.name}</h4>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>{new Date(ev.eventDateTime).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}><Ticket size={12} /> Price</p>
                  <p style={{ fontWeight: '600' }}>${ev.ticketPrice}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}><Users size={12} /> Tickets</p>
                  <p style={{ fontWeight: '600' }}>{ev.availableTickets} / {ev.totalTickets}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
