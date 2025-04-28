import React from "react";
import { FaGithub, FaPhone, FaEnvelope } from "react-icons/fa";
import { Divider } from "primereact/divider";
import { Tooltip } from "primereact/tooltip";
import { motion } from "framer-motion";
import "primeflex/primeflex.css";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-gray-200 py-6 w-full border-top-1 border-gray-800 shadow-inner no-print"
    >
      <div className="flex flex-column md:flex-row justify-content-between align-items-center px-6 gap-4">
        {/* Información principal */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-bold text-cyan-400 mb-2">
           Prueba Técnica SIMAN
          </h4>
          <p className="text-sm text-gray-300">
            Miguel Antonio Amaya Hernández &copy; 2025 — Todos los derechos reservados.
          </p>
        </div>

        {/* Íconos de contacto con animación y tooltip */}
        <div className="flex gap-5 justify-content-center">
          <a
            href="https://github.com/miguelxDd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-400 transform hover:scale-125 transition-transform duration-300"
            aria-label="GitHub"
            data-pr-tooltip="GitHub"
            data-pr-position="top"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="mailto:ah18059@ues.edu.sv"
            className="text-gray-300 hover:text-green-400 transform hover:scale-125 transition-transform duration-300"
            aria-label="Correo Electrónico"
            data-pr-tooltip="Correo"
            data-pr-position="top"
          >
            <FaEnvelope className="text-2xl" />
          </a>
          <a
            href="tel:+50377771942"
            className="text-gray-300 hover:text-yellow-400 transform hover:scale-125 transition-transform duration-300"
            aria-label="Llamar"
            data-pr-tooltip="Llamar"
            data-pr-position="top"
          >
            <FaPhone className="text-2xl" />
          </a>
        </div>
      </div>

      <Divider className="my-4" />

      <p className="text-center text-xs text-gray-300 italic">
        Desarrollado con <span className="text-pink-400 font-bold">React</span>,{" "}
        <span className="text-cyan-400 font-bold">PrimeReact</span> y{" "}
        <span className="text-yellow-300 font-bold">Spring Boot</span>.
      </p>

      <Tooltip target="[data-pr-tooltip]" />
    </motion.footer>
  );
};

export default Footer;
