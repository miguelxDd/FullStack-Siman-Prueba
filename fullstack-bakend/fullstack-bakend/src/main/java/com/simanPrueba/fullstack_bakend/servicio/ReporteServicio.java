package com.simanPrueba.fullstack_bakend.servicio;

import com.simanPrueba.fullstack_bakend.entidad.Cliente;
import com.simanPrueba.fullstack_bakend.entidad.Producto;
import com.simanPrueba.fullstack_bakend.repositorio.DetalleVentaRepositorio;
import com.simanPrueba.fullstack_bakend.repositorio.VentaRepositorio;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class ReporteServicio {
    private final DetalleVentaRepositorio detalleVentaRepositorio;
    private final VentaRepositorio ventaRepositorio;
    // Constructor
    public ReporteServicio(DetalleVentaRepositorio detalleVentaRepositorio, VentaRepositorio ventaRepositorio) {
        this.detalleVentaRepositorio = detalleVentaRepositorio;
        this.ventaRepositorio = ventaRepositorio;
    }
@Transactional(readOnly = true)
    public List<ProductoCantidadDTO> obtenerTopProductosVendidos() {
        return detalleVentaRepositorio.findTopProductosVendidos().stream()
                .limit(3)
                .map(obj -> {
                    Producto producto = (Producto) obj[0];
                    Long cantidad = (Long) obj[1];
                    return new ProductoCantidadDTO(producto.getId(), producto.getNombre(), cantidad);
                })
                .collect(Collectors.toList());
    }

    // DTO interno para el reporte:
    public record ProductoCantidadDTO(Long productoId, String nombre, Long cantidadVendida) {

    }
    @Transactional(readOnly = true)
    public ClienteIngresoDTO obtenerClienteMayorIngreso() {
        List<Object[]> resultados = ventaRepositorio.findClienteMayorIngreso();
        if (resultados.isEmpty()) {
            return null;
        }

        Object[] top = resultados.get(0);
        Cliente cliente = (Cliente) top[0];
        BigDecimal total = (BigDecimal) top[1];

        return new ClienteIngresoDTO(cliente.getId(), cliente.getNombre(), cliente.getCorreo(), total);
    }

    // DTO para el reporte:
    public record ClienteIngresoDTO(Long clienteId, String nombre, String correo, BigDecimal totalIngresos) {

    }
    @Transactional(readOnly = true)
    public BigDecimal obtenerIngresoTotalUltimoMes() {
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        BigDecimal ingreso = ventaRepositorio.obtenerIngresoUltimoMes(hace30Dias);
        return ingreso != null ? ingreso : BigDecimal.ZERO;
    }



}
