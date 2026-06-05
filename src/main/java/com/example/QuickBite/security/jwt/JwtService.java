package com.example.QuickBite.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());  // Convert the secret from string to byte array.
    }

    public String generateToken(String email){
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis()+expiration)
                )
                .signWith(getSecretKey())
                .compact();
    }

    private <T> T extractClaim(
            String token,
            Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token){
        return extractClaim(
                token,
                Claims::getSubject   // email is stored in subject
        );
    }

    public Date extractExpiration(String token){
        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

    public String extractUserName(String token){
        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token,String email){
        final String username =extractEmail(token);
        return username.equals(email) && !isTokenExpired(token);
    }
}
