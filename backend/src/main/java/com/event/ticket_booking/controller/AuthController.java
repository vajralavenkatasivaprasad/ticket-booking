package com.event.ticket_booking.controller;

import com.event.ticket_booking.dto.AuthRequest;
import com.event.ticket_booking.dto.AuthResponse;
import com.event.ticket_booking.model.User;
import com.event.ticket_booking.repository.UserRepository;
import com.event.ticket_booking.security.CustomUserDetailsService;
import com.event.ticket_booking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        if (userRepository.findByEmail(authRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email is already taken!\"}");
        }

        User user = new User();
        user.setName(authRequest.getName());
        user.setEmail(authRequest.getEmail());
        user.setPassword(passwordEncoder.encode(authRequest.getPassword()));
        
        // Ensure default role is ROLE_USER, but allow ROLE_ADMIN for demo setup
        String role = (authRequest.getRole() != null && authRequest.getRole().equals("ROLE_ADMIN")) ? "ROLE_ADMIN" : "ROLE_USER";
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("{\"message\": \"User registered successfully!\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"Incorrect email or password\"}");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        User user = userRepository.findByEmail(authRequest.getEmail()).get();
        
        final String jwt = jwtUtil.generateToken(userDetails, user.getRole());

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getName(), user.getRole()));
    }
}
