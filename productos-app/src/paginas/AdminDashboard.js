import React, { useEffect, useState } from "react";
import ProductosList from "../componentes/ProductosList";
import ClientesList from "../componentes/ClientesList";
import Reportes from "../componentes/Reportes";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { obtenerRolDesdeToken } from "../api";

const AdminDashboard = ({ setVista, vista }) => {
  const [horaActual, setHoraActual] = useState(new Date());
  const [ubicacion, setUbicacion] = useState("");
  const [bienvenidaVisible, setBienvenidaVisible] = useState(true);
  const rol = obtenerRolDesdeToken();

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUbicacion(timeZone.replace("_", " "));

    return () => clearInterval(interval);
  }, []);

  const formatearFecha = (fecha) =>
    fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatearHora = (fecha) =>
    fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  useEffect(() => {
    if (
      bienvenidaVisible &&
      (vista === "listarProductos" || vista === "clientes" || vista === "reportes")
    ) {
      setBienvenidaVisible(false);
    }
  }, [vista, bienvenidaVisible]);

  const renderBienvenida = () => (
    <Card className="mb-5 shadow-3 border-round-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">
          {rol === "ADMIN"
            ? "¡Bienvenido Administrador al Panel de Administración!"
            : "¡Bienvenido Operador al Sistema de Gestión de Productos!"}
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Hoy es <strong>{formatearFecha(horaActual)}</strong>
        </p>
        <div className="flex justify-center items-center gap-4">
          <Tag value={` ${formatearHora(horaActual)}`} severity="info" className="p-2 text-lg" />
          <Tag value={` ${ubicacion}`} severity="success" className="p-2 text-lg" />
        </div>
        <p className="mt-6 text-gray-500 italic">
          Selecciona cualquier opción del menú para comenzar...
        </p>
      </div>
    </Card>
  );

  const renderContenido = () => {
    if (rol === "ADMIN") {
      return (
        <>
          {vista === "listarProductos" && <ProductosList />}
          {vista === "clientes" && <ClientesList />}
          {vista === "reportes" && <Reportes />}
        </>
      );
    } else if (rol === "OPERADOR") {
      return <ProductosList />;
    } else {
      return (
        <p className="text-center text-red-600 font-bold">
          Rol no reconocido o no autorizado.
        </p>
      );
    }
  };

  return (
    <div className="p-4">
      {bienvenidaVisible ? renderBienvenida() : renderContenido()}
    </div>
  );
};

export default AdminDashboard;
