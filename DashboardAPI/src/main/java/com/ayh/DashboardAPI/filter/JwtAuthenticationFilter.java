package com.ayh.DashboardAPI.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtParser jwtParser;

    public JwtAuthenticationFilter(JwtParser jwtParser) {
        this.jwtParser = jwtParser;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {

        String token = extractTokenFromCookies(request);

        if (token != null) {
            try {
                Claims claims = jwtParser.parseClaimsJws(token).getBody();

                if (claims.get("type", String.class).equals("access")) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            claims.get("client"), null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT"))
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (JwtException e) {
                logger.warn("Invalid JWT token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("access_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
