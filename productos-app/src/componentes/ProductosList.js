import React, { useEffect, useState } from "react";
import api from "../api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import Swal from "sweetalert2";
import AgregarProducto from "./AgregarProducto";
import EditarProducto from "./EditarProducto";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await api.get("/productos");
      const productosOrdenados = response.data.sort((a, b) => a.stock - b.stock);
      setProductos(productosOrdenados);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos.", "error");
    }
  };

  const manejarEliminar = async (id, nombre) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás el producto "${nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.delete(`/productos/${id}`);
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
        cargarProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  const accionesTemplate = (rowData) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-warning p-button-sm"
        onClick={() => setProductoEditar(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => manejarEliminar(rowData.id, rowData.nombre)}
        tooltip="Eliminar"
      />
    </div>
  );

  const stockTemplate = (rowData) => (
    <Tag
      severity={rowData.stock < 10 ? "danger" : rowData.stock < 50 ? "warning" : "success"}
      value={rowData.stock}
    />
  );

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Productos</h2>
        <Button
          label="Agregar Producto"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => setMostrarAgregar(true)}
        />
      </div>

      <div className="flex justify-end mb-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="p-inputtext-sm pl-8"
            style={{ paddingLeft: "2rem" }}

          />
        </span>
      </div>

      <DataTable
        value={productosFiltrados}
        paginator
        rows={20}
        responsiveLayout="scroll"
        stripedRows
        emptyMessage="No se encontraron productos."
        className="p-datatable-sm"
      >
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="precio" header="Precio" sortable body={(rowData) => `$${rowData.precio}`} />
        <Column field="stock" header="Stock" sortable body={stockTemplate} />
        <Column body={accionesTemplate} header="Acciones" />
      </DataTable>

      {/* Modal de Agregar */}
      <AgregarProducto
        visible={mostrarAgregar}
        onHide={() => setMostrarAgregar(false)}
        onProductoAgregado={cargarProductos}
      />

      {/* Modal de Editar */}
      <EditarProducto
        visible={!!productoEditar}
        onHide={() => setProductoEditar(null)}
        producto={productoEditar}
        onProductoActualizado={cargarProductos}
      />
    </div>
  );
};

export default ProductosList;
