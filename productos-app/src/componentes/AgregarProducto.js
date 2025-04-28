import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import Swal from "sweetalert2";
import api from "../api";

const AgregarProducto = ({ visible, onHide, onProductoAgregado }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(null);
  const [stock, setStock] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const limpiarFormulario = () => {
    setNombre("");
    setPrecio(null);
    setStock(null);
    setSubmitted(false);
  };

  const validarFormulario = () => {
    return nombre.trim() !== "" && precio > 0 && stock > 0;
  };

  const manejarGuardar = async () => {
    setSubmitted(true);
    if (validarFormulario()) {
      try {
        await api.post("/productos", { nombre, precio, stock });
        Swal.fire("¡Éxito!", "Producto agregado correctamente.", "success");
        onProductoAgregado(); // Recarga la lista
        limpiarFormulario();
        onHide(); // Cierra el modal
      } catch (error) {
        console.error("Error al agregar producto:", error);
        Swal.fire("Error", "No se pudo agregar el producto.", "error");
      }
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={onHide} />
      <Button label="Guardar" icon="pi pi-check" onClick={manejarGuardar} />
    </div>
  );

  return (
    <Dialog
      header="Agregar Producto"
      visible={visible}
      style={{ width: "30vw" }}
      footer={footer}
      onHide={onHide}
      modal
      className="p-fluid"
    >
      <div className="field">
        <label htmlFor="nombre">Nombre</label>
        <InputText
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={submitted && nombre.trim() === "" ? "p-invalid" : ""}
        />
        {submitted && nombre.trim() === "" && <small className="p-error">El nombre es obligatorio.</small>}
      </div>

      <div className="field">
        <label htmlFor="precio">Precio ($)</label>
        <InputNumber
          id="precio"
          value={precio}
          onValueChange={(e) => setPrecio(e.value)}
          mode="currency"
          currency="USD"
          locale="en-US"
          className={submitted && (precio === null || precio <= 0) ? "p-invalid" : ""}
        />
        {submitted && (precio === null || precio <= 0) && (
          <small className="p-error">El precio debe ser mayor a 0.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="stock">Stock</label>
        <InputNumber
          id="stock"
          value={stock}
          onValueChange={(e) => setStock(e.value)}
          integeronly
          className={submitted && (stock === null || stock <= 0) ? "p-invalid" : ""}
        />
        {submitted && (stock === null || stock <= 0) && (
          <small className="p-error">El stock debe ser mayor a 0.</small>
        )}
      </div>
    </Dialog>
  );
};

export default AgregarProducto;
