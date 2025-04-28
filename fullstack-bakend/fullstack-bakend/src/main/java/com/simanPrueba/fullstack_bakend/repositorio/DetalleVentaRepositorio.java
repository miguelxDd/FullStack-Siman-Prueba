package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DetalleVentaRepositorio extends JpaRepository<DetalleVenta, Long> {
    @Query("SELECT dv.producto AS producto, SUM(dv.cantidad) AS totalCantidad " +
            "FROM DetalleVenta dv " +
            "GROUP BY dv.producto " +
            "ORDER BY totalCantidad DESC")
    List<Object[]> findTopProductosVendidos();
}
