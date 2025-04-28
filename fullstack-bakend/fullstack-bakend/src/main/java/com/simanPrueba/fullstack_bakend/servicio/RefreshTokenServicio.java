package com.simanPrueba.fullstack_bakend.servicio;


import com.simanPrueba.fullstack_bakend.entidad.RefreshToken;
import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import com.simanPrueba.fullstack_bakend.repositorio.RefreshTokenRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service

public class RefreshTokenServicio {

    private final RefreshTokenRepositorio refreshTokenRepository;


    // El toquen esta para 2 horas
    @Value("${jwt.refresh-token-duration.expiration-minutes:120}")
    private Long refreshTokenDuration;

    @Autowired
    public RefreshTokenServicio(RefreshTokenRepositorio refreshTokenRepositorio) {
        this.refreshTokenRepository = refreshTokenRepositorio;
    }
@Transactional
    public RefreshToken crearRefreshToken(Usuario usuario) {
        // Eliminar el token anterior si existe
        // Esto es para evitar que un usuario tenga varios refresh tokens activos al mismo tiempo
        refreshTokenRepository.deleteByUsuario(usuario);
        // Crear un nuevo token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsuario(usuario);
        // Generar un nuevo token
        // UUID.randomUUID().toString() genera un token aleatorio
        refreshToken.setToken(UUID.randomUUID().toString());
        // Establecer la fecha de expiración del token
        refreshToken.setFechaExpiracion(LocalDateTime.now().plusMinutes(refreshTokenDuration));
        // Guardar el token en la base de datos
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> encontrarPorToken(String token) {
        // Buscar el token en la base de datos
        return refreshTokenRepository.findByToken(token);
    }

    public boolean estaExpirado(RefreshToken refreshToken) {
        // Verificar si el token ha expirado
        return refreshToken.getFechaExpiracion().isBefore(LocalDateTime.now());
    }

    @Transactional
    public void eliminarTokenPorUsuario(Usuario usuario) {
        // Eliminar el token de la base de datos
        refreshTokenRepository.deleteByUsuario(usuario);
    }


}
