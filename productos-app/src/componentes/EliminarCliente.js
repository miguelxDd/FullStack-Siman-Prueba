import React from "react";
import api from "../api";
import Swal from "sweetalert2";

const EliminarCliente = ({ clienteId, onClienteEliminado }) => {
  const confirmarEliminacion = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el cliente de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarCliente();
      }
    });
  };

  const eliminarCliente = async () => {
    try {
      await api.delete(`/clientes/${clienteId}`);
      Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
      onClienteEliminado(); // Recarga la lista o realiza acción correspondiente
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
    }
  };

  return (
    <button
      onClick={confirmarEliminacion}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Eliminar
    </button>
  );
};

export default EliminarCliente;
