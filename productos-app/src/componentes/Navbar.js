import React from "react";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { obtenerRolDesdeToken } from "../api";

const Navbar = ({ manejarLogout, setVista }) => {
  const rol = obtenerRolDesdeToken();

  const itemsAdmin = [
    { label: "Productos", icon: "pi pi-list", command: () => setVista("listarProductos") },
    { label: "Gestión de Clientes", icon: "pi pi-users", command: () => setVista("clientes") },
    { label: "Reportes", icon: "pi pi-chart-bar", command: () => setVista("reportes") },
  ];

  const itemsOperador = [
    { label: "Productos", icon: "pi pi-list", command: () => setVista("listarProductos") },
  ];

  const items = rol === "ADMIN" ? itemsAdmin : itemsOperador;

  const end = (
    <Button
      label="Cerrar Sesión"
      icon="pi pi-sign-out"
      className="p-button-danger"
      onClick={manejarLogout}
    />
  );

  return (
    <div className="card no-print">
      <Menubar model={items} end={end} />
    </div>
  );
};

export default Navbar;
