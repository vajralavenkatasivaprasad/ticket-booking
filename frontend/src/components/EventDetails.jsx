import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Building, Ticket, Users, Cloud } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import GlassCard from './GlassCard';

const EventDetails = ({ event }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Fetch mock weather for demonstration (using Delhi coordinates since map is set to Delhi)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          setWeather(data.current_weather);
        }
      })
      .catch(err => console.error("Weather API failed", err));
  }, []);
  const formattedDate = new Date(event.eventDateTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Dummy coordinates for the venue (can be dynamic if backend provides lat/lng)
  const position = [28.6139, 77.2090]; // Delhi coordinates for example

  return (
    <GlassCard>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem', lineHeight: '1.3' }}>{event.name}</h2>
      
      <div className="event-info-item">
        <Building className="event-info-icon" size={24} />
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Department</p>
          <p style={{ fontWeight: '500' }}>{event.department}</p>
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
        <Ticket className="event-info-icon" size={24} />
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ticket Price</p>
          <p style={{ fontWeight: '500', color: 'var(--success)' }}>${event.ticketPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="event-info-item">
        <Users className="event-info-icon" size={24} />
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Availability</p>
          <p style={{ fontWeight: '500' }}>
            <span style={{ color: event.availableTickets > 0 ? 'var(--text-main)' : 'var(--error)' }}>
              {event.availableTickets}
            </span> / {event.totalTickets} tickets left
          </p>
        </div>
      </div>

      <div className="event-info-item" style={{ marginBottom: weather ? '1.5rem' : 0 }}>
        <MapPin className="event-info-icon" size={24} />
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Venue</p>
          <p style={{ fontWeight: '500' }}>{event.venue}</p>
        </div>
      </div>

      {weather && (
        <div className="event-info-item" style={{ marginBottom: 0 }}>
          <Cloud className="event-info-icon" size={24} color="var(--primary)" />
          <div>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Current Weather at Venue (Live via Open-Meteo API)</p>
            <p style={{ fontWeight: '500' }}>{weather.temperature}°C, Wind: {weather.windspeed} km/h</p>
          </div>
        </div>
      )}

      <div className="map-container">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {event.venue}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </GlassCard>
  );
};

export default EventDetails;
