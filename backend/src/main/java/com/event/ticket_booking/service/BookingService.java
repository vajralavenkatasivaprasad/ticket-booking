package com.event.ticket_booking.service;

import com.event.ticket_booking.dto.BookingRequestDTO;
import com.event.ticket_booking.model.Booking;
import com.event.ticket_booking.model.Event;
import com.event.ticket_booking.model.OtpVerification;
import com.event.ticket_booking.repository.BookingRepository;
import com.event.ticket_booking.repository.EventRepository;
import com.event.ticket_booking.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private OtpVerificationRepository otpVerificationRepository;

    @Autowired
    private EmailService emailService;

    public void generateAndSendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        
        otpVerificationRepository.save(otpVerification);
        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public Booking confirmBooking(BookingRequestDTO request) {
        // 1. Verify OTP
        OtpVerification otpVerification = otpVerificationRepository.findById(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not requested or expired"));
                
        if (!otpVerification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // 2. Process Booking
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < request.getNumberOfTickets()) {
            throw new RuntimeException("Not enough tickets available");
        }

        // Deduct tickets
        event.setAvailableTickets(event.getAvailableTickets() - request.getNumberOfTickets());
        eventRepository.save(event);

        // Create Booking record
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUserName(request.getUserName());
        booking.setEmail(request.getEmail());
        booking.setDepartment(request.getDepartment());
        booking.setNumberOfTickets(request.getNumberOfTickets());
        booking.setTotalAmount(event.getTicketPrice() * request.getNumberOfTickets());
        booking.setBookingTime(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Clear OTP after successful booking
        otpVerificationRepository.delete(otpVerification);

        return savedBooking;
    }
}
