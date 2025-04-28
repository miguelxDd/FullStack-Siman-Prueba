import React, { useState, useEffect } from "react";
import Registro from "./paginas/Registro";
import Login from "./paginas/Login";
import Footer from "./componentes/Footer";
import Navbar from "./componentes/Navbar";
import Swal from "sweetalert2";
import api from "./api";
import AdminDashboard from "./paginas/AdminDashboard";
import { obtenerRolDesdeToken } from "./api"; // Importamos la función que decodifica el rol

const App = () => {
  const [autenticado, setAutenticado] = useState(false);
  const [vista, setVista] = useState("login");
  const [rol, setRol] = useState(null); // Aquí se guarda el rol extraído del token

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    if (tokenGuardado) {
      validarToken(tokenGuardado);
    }
  }, []);

  const validarToken = (token) => {
    api
      .get("/auth/validar-token", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const rolExtraido = obtenerRolDesdeToken();
        setRol(rolExtraido);
        setAutenticado(true);
        setVista("adminDashboard");
      })
      .catch(() => {
        limpiarSesion();
      });
  };

  const manejarLogin = (token, refreshToken) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    const rolExtraido = obtenerRolDesdeToken();
    setRol(rolExtraido);
    setAutenticado(true);
    setVista("adminDashboard");
  };

  const manejarLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          Swal.fire("Error", "No se encontró el refresh token.", "error");
          limpiarSesion();
          return;
        }

        api
          .post(`/auth/logout?refreshToken=${refreshToken}`)
          .then(() => {
            Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente.", "success");
            limpiarSesion();
          })
          .catch((error) => {
            console.error("Error al cerrar sesión:", error);
            Swal.fire("Error", "El refresh token es inválido o ya expiró.", "error");
            limpiarSesion();
          });
      }
    });
  };

  const limpiarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setAutenticado(false);
    setRol(null);
    setVista("login");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {autenticado && <Navbar manejarLogout={manejarLogout} setVista={setVista} rol={rol} />}

      <main className="max-w-4xl mx-auto py-6">
        {!autenticado && vista === "login" && (
          <Login onLoginExitoso={manejarLogin} />
        )}
        {!autenticado && vista === "registro" && (
          <Registro onLoginExitoso={manejarLogin} />
        )}
        {autenticado && <AdminDashboard vista={vista} setVista={setVista} rol={rol} />}
      </main>

      {autenticado && <Footer />}
    </div>
  );
};

export default App;
