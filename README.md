# 🎟️ Event Ticket Booking System (Full-Stack)

![Advanced UI](https://img.shields.io/badge/UI-Glassmorphism-8B5CF6?style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Spring Boot](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![MySQL/H2](https://img.shields.io/badge/Database-MySQL%2FH2-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

A comprehensive, full-stack Event Ticket Booking application built for university or internal corporate events. Designed with a premium Glassmorphism UI and powered by a robust Spring Boot backend.

---

## ✨ Features (Innovation Module)

### 1. Advanced Glassmorphism UI
- **Stunning Aesthetics:** Fully custom CSS featuring deep-space dark mode, animated neon gradients, and frosted-glass cards (`backdrop-filter`).
- **Micro-Animations:** Smooth hover states, pulse effects, and seamless routing transitions.

### 2. Smart Chatbot Assistant
- A custom-built, floating AI assistant integrated directly into the frontend.
- Uses keyword-matching logic to provide instant answers to Frequently Asked Questions (FAQs) regarding payments, refunds, and ticket availability.

### 3. Real-Time Notification System
- A dedicated `NotificationContext` state manager that powers a header Notification Bell.
- Instantly pushes success alerts to the user upon event creation or ticket booking without requiring page reloads.

### 4. Third-Party API Integration (Live Weather & QR)
- **Open-Meteo API:** Asynchronously fetches and displays the live, real-time temperature and wind speed forecast for the specific event venue.
- **QR Server API:** Dynamically generates simulated payment Gateway QR codes and personal Entry Pass QR codes upon successful booking.

### 5. Role-Based Access Control (RBAC) & Security
- **JWT Authentication:** Stateless, secure token-based authentication handled by Spring Security.
- **Admin Dashboard:** Exclusive `/admin` route protected by frontend Context and backend `@PreAuthorize`. Allows Admins to securely create and broadcast new events.
- **User Dashboard:** Dedicated `/my-bookings` portal where users can permanently view and manage their purchased tickets.

---

## 🛠️ Technology Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Axios
- Context API (Auth, Events, Notifications, Bookings)
- Lucide React (Icons)
- React Leaflet (Maps)

**Backend:**
- Java (Spring Boot 3.x)
- Spring Security (JWT)
- Spring Data JPA
- H2 Embedded Database (MySQL Compatibility Mode)
- Spring Boot Starter Mail (OTP Generation)

---

## 🚀 Presentation Review Guide

If you are reviewing this project for a presentation, here is the recommended flow to demonstrate the capabilities:

1. **The Interface:** Show off the modern Glassmorphism design and the animated gradients on the main page.
2. **The Weather:** Click "View & Book" on any event to see the Open-Meteo API pulling live weather data for the venue.
3. **The Chatbot:** Open the floating purple widget in the bottom right, type "Hi" or "How do I book?", and demonstrate the automated response.
4. **The Booking Flow:** 
   - Fill out the form.
   - Proceed to the Payment Gateway (Simulated QR).
   - Enter the OTP sent (or bypassed in mock mode).
   - See the Booking Confirmation screen with the generated Entry Pass QR code.
5. **The Notifications:** Point out the red badge on the Bell icon in the top right header.
6. **The Dashboards:** 
   - Navigate to **"My Bookings"** to see the saved ticket.
   - Log in as an Admin (`admin@example.com`) to show the **Admin Panel** where new events can be added and instantly visualized.

---

*Developed with ❤️ as a Full-Stack Engineering showcase.*
