import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import api from "../api";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Para las animaciones

const EditarCliente = ({ visible, onHide, cliente, onClienteActualizado }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre);
      setCorreo(cliente.correo);
    }
  }, [cliente]);

  const handleGuardar = async () => {
    if (!nombre.trim() || !correo.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    try {
      await api.put(`/clientes/${cliente.id}`, {
        nombre,
        correo,
      });
      Swal.fire("¡Actualizado!", "El cliente ha sido actualizado correctamente.", "success");
      onClienteActualizado(); // Recarga la lista
      onHide(); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      const mensajeError = error.response?.data?.message || "Hubo un problema al actualizar el cliente.";
      Swal.fire("Error", mensajeError, "error");
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={handleGuardar} />
    </div>
  );

  return (
    <Dialog
      header="Editar Cliente"
      visible={visible}
      style={{ width: "30vw" }}
      footer={footer}
      onHide={onHide}
      closable
      modal
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-fluid">
          <div className="field mb-3">
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>
          <div className="field">
            <label htmlFor="correo">Correo</label>
            <InputText
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo del cliente"
            />
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default EditarCliente;
