import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import api from "../api";
import Swal from "sweetalert2";

const AgregarCliente = ({ visible, onHide, recargarClientes }) => {
  const [cliente, setCliente] = useState({ nombre: "", correo: "" });
  const [errores, setErrores] = useState({});

  const handleChange = (campo, valor) => {
    setCliente({ ...cliente, [campo]: valor });
    setErrores({ ...errores, [campo]: "" }); // Limpiar el error del campo al escribir
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!cliente.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }
    if (!/\S+@\S+\.\S+/.test(cliente.correo)) {
      nuevosErrores.correo = "El correo no es válido.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) return;

    try {
      await api.post("/clientes", cliente);
      Swal.fire("¡Éxito!", "Cliente agregado correctamente.", "success");
      limpiarFormulario();
      onHide();
      recargarClientes();
    } catch (error) {
      const mensajeError =
        error.response?.data?.message || "Hubo un problema al agregar el cliente.";
      Swal.fire("Error", mensajeError, "error");
    }
  };

  const limpiarFormulario = () => {
    setCliente({ nombre: "", correo: "" });
    setErrores({});
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={onHide} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-success" onClick={handleSave} />
    </div>
  );

  return (
    <Dialog
      header="Agregar Cliente"
      visible={visible}
      style={{ width: "400px" }}
      onHide={onHide}
      footer={footer}
      className="p-fluid"
      modal
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={cliente.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className={errores.nombre ? "p-invalid" : ""}
          />
          {errores.nombre && <small className="p-error">{errores.nombre}</small>}
        </div>
        <div className="field">
          <label htmlFor="correo">Correo</label>
          <InputText
            id="correo"
            value={cliente.correo}
            onChange={(e) => handleChange("correo", e.target.value)}
            className={errores.correo ? "p-invalid" : ""}
          />
          {errores.correo && <small className="p-error">{errores.correo}</small>}
        </div>
      </motion.div>
    </Dialog>
  );
};

export default AgregarCliente;
