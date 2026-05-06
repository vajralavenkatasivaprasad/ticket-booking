import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import EventDetails from '../components/EventDetails';
import BookingForm from '../components/BookingForm';

const BookingPage = () => {
  const { id } = useParams();
  const { events, fetchEvents } = useContext(EventContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    setLoading(true);
    
    if (events.length === 0) {
      await fetchEvents();
    }

    // Give context a chance to update
    const currentEvents = events.length > 0 ? events : (await fetchEvents() || []);
    // Note: EventContext fetchEvents doesn't return events currently, so it relies on the next re-render.
    
    setLoading(false);
  };

  useEffect(() => {
    if (events.length > 0) {
      const foundEvent = events.find(e => e.id.toString() === id.toString());
      if (foundEvent) {
        setEvent(foundEvent);
        setError('');
      } else {
        setError('Event not found.');
      }
      setLoading(false);
    } else {
      fetchEvent();
    }
  }, [id, events]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '1rem' }} className="text-muted">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--error)' }}>
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={fetchEvent} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <EventDetails event={event} />
      <BookingForm event={event} onBookingSuccess={fetchEvent} />
    </div>
  );
};

export default BookingPage;
