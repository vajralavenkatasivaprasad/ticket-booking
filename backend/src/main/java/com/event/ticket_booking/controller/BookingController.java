package com.event.ticket_booking.controller;

import com.event.ticket_booking.dto.BookingRequestDTO;
import com.event.ticket_booking.dto.OtpRequestDTO;
import com.event.ticket_booking.model.Booking;
import com.event.ticket_booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequestDTO request) {
        try {
            bookingService.generateAndSendOtp(request.getEmail());
            return ResponseEntity.ok().body(java.util.Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return ResponseEntity.badRequest().body(java.util.Map.of("error", errorMsg));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@Valid @RequestBody BookingRequestDTO request) {
        try {
            Booking booking = bookingService.confirmBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return ResponseEntity.badRequest().body(java.util.Map.of("error", errorMsg));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail;
        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else {
            userEmail = principal.toString();
        }
        
        List<Booking> bookings = bookingService.getBookingsByEmail(userEmail);
        return ResponseEntity.ok(bookings);
    }
}
