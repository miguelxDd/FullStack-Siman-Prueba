import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaUserAlt, FaLock, FaIdBadge, FaEnvelope } from "react-icons/fa";


const Login = ({ onLoginExitoso }) => {
  const [modo, setModo] = useState("login"); // "login" o "register"
  const [credenciales, setCredenciales] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales({ ...credenciales, [name]: value });
    setErrores({ ...errores, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const url =
      modo === "login"
        ? "http://localhost:8080/auth/login"
        : "http://localhost:8080/auth/register";

    const data =
      modo === "login"
        ? {
            correo: credenciales.correo,
            contrasenia: credenciales.contrasenia,
          }
        : {
            nombre: credenciales.nombre,
            correo: credenciales.correo,
            contrasenia: credenciales.contrasenia,
          };

    try {
      const response = await axios.post(url, data);
      console.log("Respuesta completa del backend:", response.data);


      if (modo === "login") {
        
        const { accessToken, refreshToken } = response.data;

        // Decodifica el token para obtener el campo "roles"

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);


        Swal.fire("¡Éxito!", "Inicio de sesión exitoso.", "success");
        onLoginExitoso(accessToken, refreshToken);
      } else {
        Swal.fire(
          "¡Registro exitoso!",
          "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
          "success" 
        );
        setModo("login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un problema. Intenta de nuevo.";
      Swal.fire("Error", errorMessage, "error");
      console.error("Error:", error);
    }

    
  };

  const validarFormulario = () => {
    let nuevosErrores = {};

    if (modo === "register") {
      if (!credenciales.nombre.trim())
        nuevosErrores.nombre = "El nombre es obligatorio.";
      if (!/\S+@\S+\.\S+/.test(credenciales.correo))
        nuevosErrores.correo = "El correo no es válido.";
    } else {
      if (!/\S+@\S+\.\S+/.test(credenciales.correo))
        nuevosErrores.correo = "El correo no es válido.";
    }

    if (!credenciales.contrasenia.trim())
      nuevosErrores.contrasenia = "La contraseña es obligatoria.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-800">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          {modo === "login" ? "Iniciar Sesión" : "Registrarse"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {modo === "register" && (
            <CampoTexto
              icono={<FaIdBadge />}
              name="nombre"
              placeholder="Nombre"
              value={credenciales.nombre}
              error={errores.nombre}
              onChange={handleChange}
            />
          )}
          <CampoTexto
            icono={<FaEnvelope />}
            name="correo"
            placeholder="Correo Electrónico"
            value={credenciales.correo}
            error={errores.correo}
            onChange={handleChange}
          />
          <CampoTexto
            icono={<FaLock />}
            name="contrasenia"
            placeholder="Contraseña"
            value={credenciales.contrasenia}
            error={errores.contrasenia}
            onChange={handleChange}
            type="password"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            {modo === "login" ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          {modo === "login" ? (
            <>
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => setModo("register")}
                className="text-indigo-500 hover:underline"
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una cuenta?{" "}
              <button
                onClick={() => setModo("login")}
                className="text-indigo-500 hover:underline"
              >
                Inicia sesión aquí
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

const CampoTexto = ({
  icono,
  name,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  ...props
}) => (
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-400">{icono}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full py-3 pl-10 pr-4 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
      {...props}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default Login;
