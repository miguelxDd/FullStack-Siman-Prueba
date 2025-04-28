package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepositorio extends JpaRepository<Rol, Long> {
    // Este metodo busca un rol por su nombre
    Optional<Rol> findByNombre(String nombre);
}
