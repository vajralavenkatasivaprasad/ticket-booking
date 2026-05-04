import React, { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Welcome to the Event Ticket Booking System!', read: false, time: new Date() }
  ]);

  const addNotification = (message) => {
    setNotifications(prev => [
      { id: Date.now().toString(), message, read: false, time: new Date() },
      ...prev
    ]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
