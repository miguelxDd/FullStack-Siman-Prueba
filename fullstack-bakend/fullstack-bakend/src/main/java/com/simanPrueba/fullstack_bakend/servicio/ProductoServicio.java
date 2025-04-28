package com.simanPrueba.fullstack_bakend.servicio;

import com.simanPrueba.fullstack_bakend.entidad.Producto;
import com.simanPrueba.fullstack_bakend.repositorio.ProductoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServicio {

    private final ProductoRepositorio productoRepositorio;

    // Constructor
    public ProductoServicio(ProductoRepositorio productoRepositorio) {
        this.productoRepositorio = productoRepositorio;
    }
    // Métodos CRUD
    public Producto crearProducto(Producto producto) {
        return productoRepositorio.save(producto);
    }

    public List<Producto> obtenerTodos() {
        return productoRepositorio.findAll();
    }
    // Método para obtener un producto por su ID
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepositorio.findById(id);
    }

    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        return productoRepositorio.findById(id)
                .map(producto -> {
                    producto.setNombre(productoActualizado.getNombre());
                    producto.setPrecio(productoActualizado.getPrecio());
                    producto.setStock(productoActualizado.getStock());
                    return productoRepositorio.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional
    public void eliminarProducto(Long id) {
        try {
            productoRepositorio.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el producto porque tiene ventas asociadas.");
        }
    }
}
