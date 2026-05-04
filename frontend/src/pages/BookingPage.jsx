import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EventDetails from '../components/EventDetails';
import BookingForm from '../components/BookingForm';

const BookingPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/events/${id}`);
      setEvent(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load event details. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

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
