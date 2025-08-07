package com.patwal.ecommerce.order_service.config;

import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final String SECRET_KEY = "fkjshfkjshfweiwrwre323bbsfbwb2bbb23bnbnb45nbnbnb65njbb223bvvb"; // Replace with your actual secret

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        System.out.println("JwtAuthenticationFilter: Filtering request {} {}"+ request.getMethod()+" "+ request.getRequestURI());
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: {}"+authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            System.out.println("JWT token: {}"+jwt);
            try {
                Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
                String username = claims.getSubject();
                System.out.println("JWT subject (username): {}"+ username);
                if (username != null) {
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, null);
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                System.out.println("JWT validation failed: {}"+ e.getMessage()+ e);
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            logger.warn("No Authorization header or does not start with Bearer");
        }
        filterChain.doFilter(request, response);
    }
}