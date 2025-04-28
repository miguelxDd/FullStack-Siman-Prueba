package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepositorio extends JpaRepository<Cliente, Long> {
}
