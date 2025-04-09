package com.ayh.DashboardAPI.filter;

import io.jsonwebtoken.*;
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
import java.util.Date;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtParser jwtParser;

    public JwtAuthenticationFilter(JwtParser jwtParser) {
        this.jwtParser = jwtParser;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException, java.io.IOException {

        try {
            String token = extractTokenFromCookies(request);

            if (token != null) {
                validateAndAuthenticateToken(token, request);
            }
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token has expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warn("Invalid JWT token format: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warn("Unsupported JWT token: " + e.getMessage());
        } catch (SignatureException e) {
            logger.warn("Invalid JWT signature: " + e.getMessage());
        } catch (JwtException e) {
            logger.warn("Invalid JWT token: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error processing JWT token: " + e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private void validateAndAuthenticateToken(String token, HttpServletRequest request) {
        Claims claims = jwtParser.parseClaimsJws(token).getBody();

        if (!"access".equals(claims.get("type", String.class))) {
            logger.warn("Token is not an access token");
            return;
        }

        if (claims.getExpiration() != null && claims.getExpiration().before(new Date())) {
            logger.warn("Token is expired");
            return;
        }

        String client = claims.get("client", String.class);
        if (client == null || client.isEmpty()) {
            logger.warn("Token missing client information");
            return;
        }

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                client, null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENT"))
        );

        auth.setDetails(request);

        SecurityContextHolder.getContext().setAuthentication(auth);
        logger.debug("Authentication set for client: " + client);
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
