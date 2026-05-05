import React, { createContext, useState, useContext } from 'react';

export const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Annual Tech Fest - Innovision 2026",
      department: "Computer Science and Engineering",
      eventDateTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      venue: "Main Auditorium",
      ticketPrice: 150.0,
      availableTickets: 500,
      totalTickets: 500
    },
    {
      id: 2,
      name: "AI & Future Seminar",
      department: "Artificial Intelligence",
      eventDateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      venue: "Seminar Hall B",
      ticketPrice: 50.0,
      availableTickets: 200,
      totalTickets: 200
    }
  ]);

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now(), // Mock ID generation
      availableTickets: newEvent.totalTickets
    };
    setEvents(prev => [...prev, eventWithId]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
