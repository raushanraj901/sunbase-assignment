package com.sunbase.controller;

import com.sunbase.exception.Response;
import com.sunbase.exception.StatusCode;
import com.sunbase.jwtconfig.JwtUtil;
import com.sunbase.model.Customer;
import com.sunbase.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final CustomerService customerService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @PostMapping("/registerCustomer")
    public Response<?> register(@RequestBody Customer customer) {
        if (customer.getEmail() != null && !customer.getEmail().isEmpty() && customerService.getCustomerByEmail(customer.getEmail()).isPresent())
            return new Response<>("Account already exists !", StatusCode.CONFLICT);

        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        Customer savedCustomer = customerService.saveCustomer(customer);
        return new Response<>(savedCustomer, "Registration Successful...", StatusCode.CREATED);
    }

    
    @PostMapping("/loginCustomer")
    public Response<?> login(@RequestBody Customer customer) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(customer.getEmail());

            if (!passwordEncoder.matches(customer.getPassword(), userDetails.getPassword()))
                return new Response<>("Incorrect password", StatusCode.UNAUTHORIZED);

            if (!userDetails.isAccountNonLocked())
                return new Response<>("Account is locked", StatusCode.UNAUTHORIZED);
            if (!userDetails.isEnabled())
                return new Response<>("Account is disabled", StatusCode.UNAUTHORIZED);
            if (!userDetails.isAccountNonExpired())
                return new Response<>("Account has expired", StatusCode.UNAUTHORIZED);
            if (!userDetails.isCredentialsNonExpired())
                return new Response<>("Account credentials have expired", StatusCode.UNAUTHORIZED);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    customer.getEmail(), customer.getPassword(), userDetails.getAuthorities());
            authenticationManager.authenticate(authentication);

            String jwtToken = jwtUtil.generateToken(userDetails);
            return new Response<>("Login successful", StatusCode.OK, jwtToken);

        } catch (UsernameNotFoundException e) {
            return new Response<>("User not found", StatusCode.UNAUTHORIZED);
        } catch (Exception e) {
            return new Response<>(e.getMessage(), StatusCode.UNAUTHORIZED);
        }
    }

}
