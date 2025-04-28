package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    // Este metodo busca un usuario por su correo
    // Si lo encuentra devuelve un Optional con el usuario, si no lo encuentra devuelve un Optional vacio

    Optional<Usuario> findByCorreo(String correo);

    // Este metodo busca un usuario por su correo
    // Si lo encuentra devuelve un true, si no lo encuentra devuelve false
    Boolean existsByCorreo(String correo);
}
