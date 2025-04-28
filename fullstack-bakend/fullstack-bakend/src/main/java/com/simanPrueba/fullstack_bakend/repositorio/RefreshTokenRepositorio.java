package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.RefreshToken;
import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepositorio extends JpaRepository<RefreshToken, Long> {
    // Este metodo busca un refresh token por su token
    Optional<RefreshToken> findByToken(String token);

    // Elimina todos los refresh tokens de un usuario
   void deleteByUsuario(Usuario usuario);
}
