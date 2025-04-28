import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Importa jwt-decode

const RutaPrivada = ({ children, rolesPermitidos = [] }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/" replace />;
  }

  try {
    // Decodifica el token
    const decodedToken = jwtDecode(token);
    const { roles } = decodedToken; // Obtén los roles del payload

    // Verifica si el usuario tiene un rol permitido
    const tieneAcceso = rolesPermitidos.length === 0 || roles.some((rol) => rolesPermitidos.includes(rol));

    if (!tieneAcceso) {
      // Si no tiene acceso, redirige a una página de acceso denegado
      return <Navigate to="/acceso-denegado" replace />;
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    // Si el token es inválido, redirige al login
    return <Navigate to="/" replace />;
  }

  // Si el token es válido y el usuario tiene acceso, muestra el contenido
  return children;
};

export default RutaPrivada;