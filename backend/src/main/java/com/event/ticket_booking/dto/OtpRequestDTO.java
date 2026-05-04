package com.event.ticket_booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class OtpRequestDTO {
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    private String email;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
