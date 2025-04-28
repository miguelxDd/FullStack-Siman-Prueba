package com.simanPrueba.fullstack_bakend.servicio;

import com.simanPrueba.fullstack_bakend.dto.VentaRequest;
import com.simanPrueba.fullstack_bakend.entidad.Cliente;
import com.simanPrueba.fullstack_bakend.entidad.DetalleVenta;
import com.simanPrueba.fullstack_bakend.entidad.Producto;
import com.simanPrueba.fullstack_bakend.entidad.Venta;
import com.simanPrueba.fullstack_bakend.repositorio.ClienteRepositorio;
import com.simanPrueba.fullstack_bakend.repositorio.DetalleVentaRepositorio;
import com.simanPrueba.fullstack_bakend.repositorio.ProductoRepositorio;
import com.simanPrueba.fullstack_bakend.repositorio.VentaRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class VentaServicio {

    private final VentaRepositorio ventaRepositorio;
    private final DetalleVentaRepositorio detalleVentaRepositorio;
    private final ClienteRepositorio clienteRepositorio;
    private final ProductoRepositorio productoRepositorio;
    private final DetalleVentaRepositorio detalleVentaRepoitorio;

    //Constructor
    public VentaServicio(VentaRepositorio ventaRepositorio, DetalleVentaRepositorio detalleVentaRepositorio,
                         ClienteRepositorio clienteRepositorio, ProductoRepositorio productoRepositorio,
                         DetalleVentaRepositorio detalleVentaRepoitorio) {
        this.ventaRepositorio = ventaRepositorio;
        this.detalleVentaRepositorio = detalleVentaRepositorio;
        this.clienteRepositorio = clienteRepositorio;
        this.productoRepositorio = productoRepositorio;
        this.detalleVentaRepoitorio = detalleVentaRepoitorio;
    }


    @Transactional
    public Venta registrarVenta(VentaRequest ventaRequest) {
        // Validar el cliente
        Cliente cliente = clienteRepositorio.findById(ventaRequest.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        Venta venta = new Venta();
        venta.setCliente(cliente);

        List<DetalleVenta> detalles = new ArrayList<>();
        BigDecimal totalVenta = BigDecimal.ZERO;

        for (VentaRequest.DetalleRequest detalleRequest : ventaRequest.getDetalles()) {
            Producto producto = productoRepositorio.findById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Restar stock
            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoRepositorio.save(producto);

            BigDecimal subtotal = BigDecimal.valueOf(producto.getPrecio()).multiply(BigDecimal.valueOf(detalleRequest.getCantidad()));


            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleRequest.getCantidad());
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);

            detalles.add(detalle);
            totalVenta = totalVenta.add(subtotal);
        }

        venta.setTotal(totalVenta);
        venta.setDetalles(detalles);

        // Guardar la venta (cascada guarda los detalles también)
        return ventaRepositorio.save(venta);
    }


}
