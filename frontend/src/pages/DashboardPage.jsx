import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, Building, Ticket } from 'lucide-react';

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const res = await axios.get('http://localhost:8080/api/events');
        // setEvents(res.data);
        setEvents([
          {
            id: 1,
            name: "Annual Tech Fest - Innovision 2026",
            department: "Computer Science and Engineering",
            eventDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            venue: "Main Auditorium",
            ticketPrice: 150.0,
            availableTickets: 500,
            totalTickets: 500
          }
        ]);
      } catch (err) {
        console.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Upcoming Events</h3>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><span className="loader"></span></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map(event => (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{event.name}</h4>
              <div style={{ flex: 1 }}>
                <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Building size={16} /> {event.department}
                </p>
                <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={16} /> {new Date(event.eventDateTime).toLocaleDateString()}
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  <Ticket size={16} /> ${event.ticketPrice.toFixed(2)}
                </p>
              </div>
              <Link to={`/event/${event.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>
                View & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
