package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepositorio extends JpaRepository<Producto, Long> {
}
