import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const BookingContext = createContext();

export const useBookings = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.token) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [auth]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      // Backend returns oldest first usually, so reverse to show newest first
      setBookings(response.data.reverse());
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const addBooking = (booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
