package com.event.ticket_booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Event Ticket Booking OTP");
            message.setText("Your OTP for ticket booking is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send real email. Check your SMTP credentials in Render: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String newPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Password Has Been Reset");
            message.setText("You requested a password reset.\n\nYour new temporary password is: " + newPassword + "\n\nPlease login and change it immediately.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send real email. Check your SMTP credentials in Render: " + e.getMessage());
        }
    }
}
