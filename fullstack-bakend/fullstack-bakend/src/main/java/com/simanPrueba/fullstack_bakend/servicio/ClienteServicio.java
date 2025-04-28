package com.simanPrueba.fullstack_bakend.servicio;

import com.simanPrueba.fullstack_bakend.entidad.Cliente;
import com.simanPrueba.fullstack_bakend.repositorio.ClienteRepositorio;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteServicio {

    private final ClienteRepositorio clienteRepositorio;

    //Constructor
    public ClienteServicio(ClienteRepositorio clienteRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
    }

    public Cliente crearCliente(Cliente cliente) {
        return clienteRepositorio.save(cliente);
    }

    public List<Cliente> obtenerTodos() {
        return clienteRepositorio.findAll();
    }

    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepositorio.findById(id);
    }

    public Cliente actualizarCliente(Long id, Cliente clienteActualizado) {
        return clienteRepositorio.findById(id)
                .map(cliente -> {
                    cliente.setNombre(clienteActualizado.getNombre());
                    cliente.setCorreo(clienteActualizado.getCorreo());
                    return clienteRepositorio.save(cliente);
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado en la base de datos."));
    }

    public void eliminarCliente(Long id) {
        try {
            clienteRepositorio.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el cliente porque tiene ventas registradas.");
        }
    }
}
