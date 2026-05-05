import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useBookings } from '../context/BookingContext';
import GlassCard from './GlassCard';

const BookingForm = ({ event, onBookingSuccess }) => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { addBooking } = useBookings();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    department: '',
    numberOfTickets: 1
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    
    const tickets = Number(formData.numberOfTickets);
    if (!tickets || tickets < 1) {
      newErrors.numberOfTickets = 'Must book at least 1 ticket';
    } else if (tickets > event.availableTickets) {
      newErrors.numberOfTickets = `Only ${event.availableTickets} tickets available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const totalAmount = (formData.numberOfTickets * event.ticketPrice) || 0;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowPaymentModal(true);
  };

  const handleSimulatePayment = async () => {
    if (!transactionId.trim() || transactionId.length < 5) {
      setPaymentError('Please enter a valid Transaction ID');
      return;
    }
    setPaymentError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/bookings/send-otp', { email: formData.email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPaymentModal(false);
      setShowOtpModal(true);
    } catch (err) {
      setPaymentError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bookings/confirm', {
        eventId: event.id,
        userName: formData.userName,
        email: formData.email,
        department: formData.department,
        numberOfTickets: Number(formData.numberOfTickets),
        otp: otp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      addBooking(response.data);
      
      setShowOtpModal(false);
      addNotification(`Successfully booked ${formData.numberOfTickets} tickets for ${event.name}!`);
      onBookingSuccess();
      navigate('/summary', { state: { booking: response.data } });
    } catch (err) {
      setOtpError('Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ userName: '', email: '', department: '', numberOfTickets: 1 });
    setErrors({});
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EventPayment_${event.id}_Amount_${totalAmount}`;

  return (
    <GlassCard>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Book Your Tickets</h3>
      
      <form onSubmit={handleProceedToPayment}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="userName" className="form-input" value={formData.userName} onChange={handleChange} placeholder="John Doe" />
          {errors.userName && <p className="text-error">{errors.userName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Email ID</label>
          <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
          {errors.email && <p className="text-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} placeholder="e.g. Computer Science" />
          {errors.department && <p className="text-error">{errors.department}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Number of Tickets</label>
          <input type="number" name="numberOfTickets" className="form-input" min="1" max={event.availableTickets} value={formData.numberOfTickets} onChange={handleChange} />
          {errors.numberOfTickets && <p className="text-error">{errors.numberOfTickets}</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem' }}>
          <span className="text-muted">Total Amount</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${totalAmount.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={handleReset} className="btn btn-secondary" style={{ flex: 1 }}>Reset</button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={event.availableTickets === 0}>
            Proceed to Payment
          </button>
        </div>
      </form>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Payment Gateway</h3>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>Scan the QR code below to pay <strong>${totalAmount.toFixed(2)}</strong></p>
            
            <div style={{ padding: '1rem', background: 'white', display: 'inline-block', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <img src={qrUrl} alt="Payment QR" style={{ display: 'block' }} />
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Transaction ID</label>
              <input type="text" className="form-input" placeholder="Enter Transaction ID (e.g. TXN12345)" value={transactionId} onChange={(e) => { setTransactionId(e.target.value); setPaymentError(''); }} />
              {paymentError && <p className="text-error">{paymentError}</p>}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSimulatePayment} disabled={loading}>
                {loading ? <span className="loader"></span> : 'Verify Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '0.5rem' }}>Verify Email</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Payment verified! We've sent a 6-digit OTP to {formData.email}.
            </p>
            
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Enter OTP" value={otp} onChange={(e) => { setOtp(e.target.value); setOtpError(''); }} maxLength={6} style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }} />
              {otpError && <p className="text-error" style={{ textAlign: 'center' }}>{otpError}</p>}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleConfirmBooking} disabled={loading}>
                {loading ? <span className="loader"></span> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default BookingForm;
