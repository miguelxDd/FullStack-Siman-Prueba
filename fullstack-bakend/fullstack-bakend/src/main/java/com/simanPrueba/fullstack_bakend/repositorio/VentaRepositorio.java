package com.simanPrueba.fullstack_bakend.repositorio;

import com.simanPrueba.fullstack_bakend.entidad.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface VentaRepositorio extends JpaRepository<Venta, Long> {
    @Query("SELECT v.cliente AS cliente, SUM(v.total) AS totalIngresos " +
            "FROM Venta v " +
            "GROUP BY v.cliente " +
            "ORDER BY totalIngresos DESC")
    List<Object[]> findClienteMayorIngreso();

    @Query("SELECT SUM(v.total) FROM Venta v WHERE v.fecha >= :fechaInicio")
    BigDecimal obtenerIngresoUltimoMes(@Param("fechaInicio") LocalDateTime fechaInicio);



}
