package com.sunbase.jwtconfig;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	
	private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    
	public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtUtil jwtUtil) {
		this.userDetailsService = userDetailsService;
		this.jwtUtil = jwtUtil;
	}

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        log.info("Check if the Authorization header is present and starts with Bearer");
        String jwtToken = null;
        String email = null;

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwtToken = authorizationHeader.substring(7);
                email = jwtUtil.extractUsername(jwtToken);
            }
        } catch (Exception e) {
            log.error("JWT parsing failed: " + e.getMessage());
        }

        log.info("Validate the extracted email and ensure no existing authentication in the SecurityContext");
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            log.info("Validate the JWT token and set the authentication in the SecurityContext if valid");
            if (jwtToken != null && jwtUtil.validateToken(jwtToken, userDetails)) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        log.info("Continue with the next filter in the chain");
        filterChain.doFilter(request, response);
    }

}
