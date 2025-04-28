package com.simanPrueba.fullstack_bakend.controlador;

import com.simanPrueba.fullstack_bakend.servicio.ReporteServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/reportes")
public class ReporteControlador {
    private final ReporteServicio reporteServicio;
    // Constructor
    public ReporteControlador(ReporteServicio reporteServicio) {
        this.reporteServicio = reporteServicio;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/top-productos")
    public ResponseEntity<List<ReporteServicio.ProductoCantidadDTO>> obtenerTopProductos() {
        return ResponseEntity.ok(reporteServicio.obtenerTopProductosVendidos());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cliente-mayor-ingreso")
    public ResponseEntity<ReporteServicio.ClienteIngresoDTO> obtenerClienteMayorIngreso() {
        return ResponseEntity.ok(reporteServicio.obtenerClienteMayorIngreso());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ingreso-ultimo-mes")
    public ResponseEntity<BigDecimal> obtenerIngresoUltimoMes() {
        return ResponseEntity.ok(reporteServicio.obtenerIngresoTotalUltimoMes());
    }

}
