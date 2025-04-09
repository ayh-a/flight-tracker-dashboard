package com.ayh.DashboardAPI.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Base64;

public class JwtConfig {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public Key jwtAccessKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Bean
    public JwtParser jwtParser() {
        return Jwts.parserBuilder().setSigningKey(jwtAccessKey()).build();
    }
}
