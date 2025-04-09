package com.ayh.DashboardAPI.config;

import com.ayh.DashboardAPI.filter.JwtAuthenticationFilter;
import io.jsonwebtoken.JwtParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtParser jwtParser;

    public SecurityConfig(JwtParser jwtParser) {
        this.jwtParser = jwtParser;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtParser),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}