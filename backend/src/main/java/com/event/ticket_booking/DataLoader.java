package com.event.ticket_booking;

import com.event.ticket_booking.model.Event;
import com.event.ticket_booking.model.User;
import com.event.ticket_booking.repository.EventRepository;
import com.event.ticket_booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(EventRepository eventRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin User
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
            }

            if (eventRepository.count() == 0) {
                Event e1 = new Event();
                e1.setName("Annual Tech Fest - Innovision 2026");
                e1.setDepartment("Computer Science and Engineering");
                e1.setEventDateTime(LocalDateTime.now().plusDays(30));
                e1.setVenue("Main Auditorium, Engineering Block");
                e1.setTicketPrice(150.0);
                e1.setTotalTickets(500);
                e1.setAvailableTickets(500);
                
                Event e2 = new Event();
                e2.setName("AI & Robotics Symposium");
                e2.setDepartment("Artificial Intelligence");
                e2.setEventDateTime(LocalDateTime.now().plusDays(15));
                e2.setVenue("Seminar Hall A");
                e2.setTicketPrice(50.0);
                e2.setTotalTickets(200);
                e2.setAvailableTickets(200);

                Event e3 = new Event();
                e3.setName("Cybersecurity Hackathon");
                e3.setDepartment("Information Technology");
                e3.setEventDateTime(LocalDateTime.now().plusDays(45));
                e3.setVenue("IT Labs 1-4");
                e3.setTicketPrice(0.0);
                e3.setTotalTickets(100);
                e3.setAvailableTickets(100);

                Event e4 = new Event();
                e4.setName("Web3 and Blockchain Summit");
                e4.setDepartment("Computer Applications");
                e4.setEventDateTime(LocalDateTime.now().plusDays(60));
                e4.setVenue("Conference Room B");
                e4.setTicketPrice(200.0);
                e4.setTotalTickets(300);
                e4.setAvailableTickets(300);

                Event e5 = new Event();
                e5.setName("Cloud Computing Workshop");
                e5.setDepartment("Software Engineering");
                e5.setEventDateTime(LocalDateTime.now().plusDays(10));
                e5.setVenue("Lab Complex C");
                e5.setTicketPrice(75.0);
                e5.setTotalTickets(50);
                e5.setAvailableTickets(50);

                eventRepository.saveAll(java.util.Arrays.asList(e1, e2, e3, e4, e5));
            }
        };
    }
}
