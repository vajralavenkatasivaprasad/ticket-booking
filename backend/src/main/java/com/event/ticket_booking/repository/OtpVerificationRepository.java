package com.event.ticket_booking.repository;

import com.event.ticket_booking.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, String> {
}
