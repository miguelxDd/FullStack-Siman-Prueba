import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import api from "../api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const EditarProducto = ({ visible, onHide, producto, onProductoActualizado }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(null);
  const [stock, setStock] = useState(null);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || "");
      setPrecio(producto.precio || 0);
      setStock(producto.stock || 0);
    }
  }, [producto]);

  const validarFormulario = () => {
    let nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (precio <= 0) nuevosErrores.precio = "El precio debe ser mayor a 0.";
    if (stock < 0) nuevosErrores.stock = "El stock debe ser mayor o igual a 0.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    try {
      await api.put(`/productos/${producto.id}`, {
        nombre,
        precio,
        stock,
      });
      Swal.fire("¡Éxito!", "Producto actualizado correctamente.", "success");
      onProductoActualizado(); // Recargar productos en el listado
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Swal.fire("Error", "No se pudo actualizar el producto.", "error");
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Guardar" icon="pi pi-check" onClick={handleGuardar} />
    </div>
  );

  return (
    <Dialog
      header="Editar Producto"
      visible={visible}
      onHide={onHide}
      footer={footer}
      className="p-fluid"
      modal
    >
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-2 font-semibold">
            Nombre:
          </label>
          <InputText
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={errores.nombre ? "p-invalid" : ""}
            placeholder="Nombre del producto"
          />
          {errores.nombre && <small className="p-error">{errores.nombre}</small>}
        </div>

        <div className="mb-4">
          <label htmlFor="precio" className="block mb-2 font-semibold">
            Precio:
          </label>
          <InputNumber
            id="precio"
            value={precio}
            onValueChange={(e) => setPrecio(e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={errores.precio ? "p-invalid" : ""}
            placeholder="Precio del producto"
          />
          {errores.precio && <small className="p-error">{errores.precio}</small>}
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block mb-2 font-semibold">
            Stock:
          </label>
          <InputNumber
            id="stock"
            value={stock}
            onValueChange={(e) => setStock(e.value)}
            min={1}
            showButtons
            className={errores.stock ? "p-invalid" : ""}
            placeholder="Stock disponible"
          />
          {errores.stock && <small className="p-error">{errores.stock}</small>}
        </div>
      </motion.div>
    </Dialog>
  );
};

export default EditarProducto;
