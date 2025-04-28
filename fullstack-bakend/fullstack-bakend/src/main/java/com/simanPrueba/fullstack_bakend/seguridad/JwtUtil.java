package com.simanPrueba.fullstack_bakend.seguridad;

import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-minutes}")
    private long expirationMinutes;

    private Key key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generarToken(Usuario usuario) {
        long ahora = System.currentTimeMillis();
        Date fechaExpiracion = new Date(ahora + expirationMinutes * 60 * 1000);

        String roles = usuario.getRoles()
                .stream()
                .map(r -> r.getNombre())
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(usuario.getCorreo())
                .claim("id", usuario.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date(ahora))
                .setExpiration(fechaExpiracion)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean esTokenValido(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extraerCorreo(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Claims extraerClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody();
    }
}
