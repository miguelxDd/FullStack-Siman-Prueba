package com.simanPrueba.fullstack_bakend.controlador;

import com.simanPrueba.fullstack_bakend.dto.VentaRequest;
import com.simanPrueba.fullstack_bakend.entidad.Venta;
import com.simanPrueba.fullstack_bakend.servicio.VentaServicio;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaControlador {
    private final VentaServicio ventaServicio;

    //constructor
    public VentaControlador(VentaServicio ventaServicio) {
        this.ventaServicio = ventaServicio;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaRequest ventaRequest) {
        return ResponseEntity.ok(ventaServicio.registrarVenta(ventaRequest));
    }


}
