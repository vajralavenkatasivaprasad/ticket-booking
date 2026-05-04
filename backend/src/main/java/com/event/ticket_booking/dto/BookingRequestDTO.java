package com.event.ticket_booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookingRequestDTO {

    @NotNull(message = "Event ID is mandatory")
    private Long eventId;

    @NotBlank(message = "Name is mandatory")
    private String userName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Department is mandatory")
    private String department;

    @NotNull(message = "Number of tickets is mandatory")
    @Min(value = 1, message = "Number of tickets must be at least 1")
    private Integer numberOfTickets;

    private String otp;

    // Getters and Setters
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Integer getNumberOfTickets() { return numberOfTickets; }
    public void setNumberOfTickets(Integer numberOfTickets) { this.numberOfTickets = numberOfTickets; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
