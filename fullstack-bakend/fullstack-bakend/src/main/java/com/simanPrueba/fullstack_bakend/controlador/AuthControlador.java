package com.simanPrueba.fullstack_bakend.controlador;


import com.simanPrueba.fullstack_bakend.dto.LoginRequest;
import com.simanPrueba.fullstack_bakend.dto.RegistroRequest;
import com.simanPrueba.fullstack_bakend.dto.TokenResponse;
import com.simanPrueba.fullstack_bakend.entidad.RefreshToken;
import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import com.simanPrueba.fullstack_bakend.seguridad.JwtUtil;
import com.simanPrueba.fullstack_bakend.servicio.AuthServicio;
import com.simanPrueba.fullstack_bakend.servicio.RefreshTokenServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthControlador {
    private final AuthServicio authServicio;
    private final RefreshTokenServicio refreshTokenServicio;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthControlador(AuthServicio authServicio, RefreshTokenServicio refreshTokenServicio, JwtUtil jwtUtil) {
        this.authServicio = authServicio;
        this.refreshTokenServicio = refreshTokenServicio;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrar(@RequestBody RegistroRequest request) {
        authServicio.registrar(request.getNombre(), request.getCorreo(), request.getContrasenia());
        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        Usuario usuario = authServicio.validarLogin(request.getCorreo(), request.getContrasenia());

        String accessToken = jwtUtil.generarToken(usuario);
        RefreshToken refreshToken = refreshTokenServicio.crearRefreshToken(usuario);

        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestParam String refreshToken) {
        Optional<RefreshToken> tokenOptional = refreshTokenServicio.encontrarPorToken(refreshToken);

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Refresh token inválido o ya expiró.");
        }

        RefreshToken token = tokenOptional.get();

        if (token.getFechaExpiracion().isBefore(LocalDateTime.now()) || token.getUsado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Refresh token expirado o ya usado.");
        }

        // ✅ Si el token es válido, genera nuevo JWT:
        String newAccessToken = jwtUtil.generarToken(token.getUsuario());
        return ResponseEntity.ok(Map.of("token", newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String refreshToken) {
        Optional<RefreshToken> tokenOptional = refreshTokenServicio.encontrarPorToken(refreshToken);

        if (tokenOptional.isPresent()) {
            RefreshToken token = tokenOptional.get();
            refreshTokenServicio.eliminarTokenPorUsuario(token.getUsuario());
        } else {
            // Aquí no lanzas excepción, solo notificas que el token no existía o ya expiró.
            return ResponseEntity.ok("El refresh token ya fue eliminado o no existe.");
        }

        return ResponseEntity.ok("Sesión cerrada exitosamente.");
    }
    @GetMapping("/validar-token")
    public ResponseEntity<String> validarToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authHeader.substring(7); // Quitamos "Bearer "
        if (!jwtUtil.esTokenValido(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Token inválido o expirado");
        }

        return ResponseEntity.ok("Token válido");
    }



}
