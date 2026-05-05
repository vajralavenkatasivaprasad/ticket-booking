import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (newEvent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/events', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
