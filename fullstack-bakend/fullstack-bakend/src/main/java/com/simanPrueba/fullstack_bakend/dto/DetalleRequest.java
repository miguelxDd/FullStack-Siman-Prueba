package com.simanPrueba.fullstack_bakend.dto;

public class DetalleRequest {
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
