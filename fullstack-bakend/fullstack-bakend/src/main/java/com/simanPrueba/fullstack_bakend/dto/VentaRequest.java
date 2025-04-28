package com.simanPrueba.fullstack_bakend.dto;

import java.util.List;

public class VentaRequest {
    private Long clienteId;
    private List<DetalleRequest> detalles;
    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
    public List<DetalleRequest> getDetalles() {
        return detalles;
    }
    public void setDetalles(List<DetalleRequest> detalles) {
        this.detalles = detalles;
    }
    public static class DetalleRequest {
        private Long productoId;
        private Integer cantidad;
        // Getters y Setters
        public Long getProductoId() {
            return productoId;
        }
        public void setProductoId(Long productoId) {
            this.productoId = productoId;
        }
        public Integer getCantidad() {
            return cantidad;
        }
        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }
    }
}
