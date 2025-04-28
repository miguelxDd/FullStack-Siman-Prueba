import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Registro = ({ onLoginExitoso }) => {
  const [usuario, setUsuario] = useState({
    username: "",
    password: "",
    nombre: "",
    apellido: "",
    email: "",
    fechaNacimiento: "",
    documentoIdentidad: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const validarCampos = () => {
    const { username, password, nombre, apellido, email, fechaNacimiento, documentoIdentidad } = usuario;

    if (username.length < 3 || username.length > 50) {
      Swal.fire("Error", "El nombre de usuario debe tener entre 3 y 50 caracteres.", "error");
      return false;
    }

    if (password.length < 8) {
      Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres.", "error");
      return false;
    }

    if (!nombre.trim() || !apellido.trim()) {
      Swal.fire("Error", "El nombre y apellido son obligatorios.", "error");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire("Error", "El correo electrónico no es válido.", "error");
      return false;
    }

    if (!fechaNacimiento) {
      Swal.fire("Error", "La fecha de nacimiento es obligatoria.", "error");
      return false;
    }

    if (!/^\d{9}$/.test(documentoIdentidad)) {
      Swal.fire("Error", "El documento de identidad debe tener 9 dígitos numéricos.", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    // Realizar la solicitud al endpoint de registro
    axios
      .post("http://localhost:8080/api/auth/register", usuario)
      .then(() => {
        Swal.fire("¡Éxito!", "Usuario registrado exitosamente. Iniciando sesión...", "success");

        // Iniciar sesión automáticamente
        const credenciales = {
          username: usuario.username, // Usar el username
          password: usuario.password, // Usar la misma contraseña
        };

        return axios.post("http://localhost:8080/api/auth/login", credenciales);
      })
      .then((response) => {
        Swal.fire("¡Bienvenido!", "Inicio de sesión exitoso.", "success");
        onLoginExitoso(); // Notificar al componente App.js
      })
      .catch((error) => {
        Swal.fire("Error", error.response?.data || "Hubo un problema.", "error");
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Registro de Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={usuario.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            value={usuario.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={usuario.fechaNacimiento}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Documento de Identidad</label>
          <input
            type="text"
            name="documentoIdentidad"
            value={usuario.documentoIdentidad}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Registro;
