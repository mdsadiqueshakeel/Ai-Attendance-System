package com.smartattendance.security;

import com.smartattendance.config.AppProperties;
import com.smartattendance.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    private final AppProperties props;
    private SecretKey key;

    public JwtService(AppProperties props) {
        this.props = props;
    }

    @PostConstruct
    void init() {
        String secret = props.getJwt().getSecret();
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT secret is missing (set app.jwt.secret or JWT_SECRET env var).");
        }
        // HS256 requires at least 256-bit key. Enforce a reasonable minimum.
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT secret too short; use at least 32 characters.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Instant exp = now.plus(props.getJwt().getAccessTokenTtlMinutes(), ChronoUnit.MINUTES);

        return Jwts.builder()
                .setIssuer(props.getJwt().getIssuer())
                .setSubject(user.getEmail())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .claim("uid", user.getId().toString())
                .claim("role", user.getRole().name())
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(props.getJwt().getIssuer())
                .build()
                .parseSignedClaims(token);
    }

    public String extractEmail(String token) {
        return parse(token).getBody().getSubject();
    }

    public UUID extractUserId(String token) {
        String uid = parse(token).getBody().get("uid", String.class);
        return uid == null ? null : UUID.fromString(uid);
    }
}
