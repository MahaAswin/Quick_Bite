package com.example.QuickBite.security.jwt;

import com.example.QuickBite.security.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter{

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtFilter(JwtService jwtService, CustomUserDetailsService customUserDetailsService) {
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
//        System.out.println("JWT FILTER EXECUTED");
        String authHeader =
                request.getHeader("Authorization");
//        System.out.println("Header = " + authHeader);

        if(authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }

        System.out.println("AUTH HEADER = " + authHeader);
        String jwt = authHeader.substring(7).trim();

        if(jwt.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }
        //System.out.println("JWT = " + jwt);
        String email = jwtService.extractUserName(jwt);
        //System.out.println("Email = " + email);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        System.out.println(
                "Authorities = " +
                        userDetails.getAuthorities()
        );
//        System.out.println(
//                "Email = " +
//                        userDetails.getUsername()
//        );

        if(jwtService.isTokenValid(jwt, userDetails.getUsername())) {

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authToken);

            System.out.println("User Authenticated");
        }
        //System.out.println("User = " + userDetails.getUsername());

        filterChain.doFilter(
                request,
                response
        );
    }
}
