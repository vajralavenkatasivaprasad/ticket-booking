package com.event.ticket_booking.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendOtpEmail(String to, String otp) {
        // In a real application, we would use JavaMailSender to send an actual email.
        // For the sake of this demo (Innovation Module), we'll simulate sending it
        // by logging it to the console to make testing easy without requiring real SMTP credentials.
        
        System.out.println("=================================================");
        System.out.println("Mock Email Server");
        System.out.println("To: " + to);
        System.out.println("Subject: Your Event Ticket Booking OTP");
        System.out.println("Body: Your OTP for ticket booking is " + otp + ". It is valid for 5 minutes.");
        System.out.println("=================================================");
    }
}
