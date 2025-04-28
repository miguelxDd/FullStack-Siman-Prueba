import React, { useEffect, useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import EditarCliente from "./EditarCliente";
import AgregarCliente from "./AgregarCliente";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false); // Estado para agregar

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get("/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
    }
  };

  const eliminarCliente = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete(`/clientes/${id}`)
          .then(() => {
            Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
            cargarClientes();
          })
          .catch((error) => {
            console.error("Error al eliminar cliente:", error);
            const mensajeError =
              error.response?.data?.message || "Hubo un problema al eliminar el cliente.";
            Swal.fire("Error", mensajeError, "error");
          });
      }
    });
  };

  const abrirModalEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModalEditar(true);
  };

  const cerrarModalEditar = () => {
    setClienteSeleccionado(null);
    setMostrarModalEditar(false);
  };

  const abrirModalAgregar = () => {
    setMostrarModalAgregar(true);
  };

  const cerrarModalAgregar = () => {
    setMostrarModalAgregar(false);
  };

  const accionesTemplate = (rowData) => (
    <div className="flex gap-2 justify-center">
      <Button
        icon="pi pi-pencil"
        className="p-button-warning"
        onClick={() => abrirModalEditar(rowData)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => eliminarCliente(rowData.id)}
        tooltip="Eliminar"
      />
    </div>
  );

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Clientes</h2>

      <div className="flex justify-between mb-4">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar Cliente"
            className="p-inputtext-sm pl-8"
            style={{ paddingLeft: "2rem" }}
          />
        </span>
        <Button
          label="Agregar Cliente"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={abrirModalAgregar}
        />
      </div>

      <DataTable
        value={clientesFiltrados}
        paginator
        rows={20}
        responsiveLayout="scroll"
        emptyMessage="No hay clientes registrados."
        stripedRows
        className="p-datatable-sm"
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="correo" header="Correo" sortable></Column>
        <Column body={accionesTemplate} header="Acciones"></Column>
      </DataTable>

      {/* Modal de Edición */}
      <EditarCliente
        visible={mostrarModalEditar}
        onHide={cerrarModalEditar}
        cliente={clienteSeleccionado}
        onClienteActualizado={cargarClientes}
      />

      {/* Modal de Agregar */}
      <AgregarCliente
        visible={mostrarModalAgregar}
        onHide={cerrarModalAgregar}
        recargarClientes={cargarClientes}
      />
    </div>
  );
};

export default ClientesList;
