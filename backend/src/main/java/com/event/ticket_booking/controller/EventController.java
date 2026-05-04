package com.event.ticket_booking.controller;

import com.event.ticket_booking.model.Event;
import com.event.ticket_booking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        // Validation could be added here
        event.setAvailableTickets(event.getTotalTickets()); // initially available = total
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(savedEvent);
    }
}
