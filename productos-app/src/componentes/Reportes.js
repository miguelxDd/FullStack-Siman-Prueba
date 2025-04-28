import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { motion } from "framer-motion";

const ReporteVentas = () => {
  const [topProductos, setTopProductos] = useState([]);
  const [clienteMayorIngreso, setClienteMayorIngreso] = useState(null);
  const [ingresoUltimoMes, setIngresoUltimoMes] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const productosResponse = await api.get("/reportes/top-productos");
      setTopProductos(productosResponse.data);

      const clienteResponse = await api.get("/reportes/cliente-mayor-ingreso");
      setClienteMayorIngreso(clienteResponse.data);

      const ingresoResponse = await api.get("/reportes/ingreso-ultimo-mes");
      setIngresoUltimoMes(ingresoResponse.data);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los reportes.",
        life: 3000,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          📈 Reportes de Ventas
        </h2>
        <Button
          label="Imprimir Reporte"
          icon="pi pi-print"
          className="p-button-outlined p-button-secondary no-print"
          onClick={handlePrint}
        />
      </div>

      <Divider align="left">
  <span className="text-indigo-600 font-bold">Top 3 Productos Más Vendidos</span>
</Divider>

<ol className="list-decimal pl-6 space-y-3 text-gray-700 text-lg mb-6">
  {topProductos.map((producto, index) => (
    <motion.li
      key={producto.productoId}
      className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div>
        <span className="font-bold text-indigo-700">
          {index + 1}. {producto.nombre}
        </span>
        <span className="text-sm text-gray-500 ml-2">(ID: {producto.productoId})</span>
      </div>
      <Tag severity="info" value={`Vendidos: ${producto.cantidadVendida}`} />
    </motion.li>
  ))}
</ol>


      <Divider align="left">
        <span className="text-indigo-600 font-bold">Cliente con Mayor Ingreso</span>
      </Divider>

      {clienteMayorIngreso && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            title={clienteMayorIngreso.nombre}
            subTitle={`Correo: ${clienteMayorIngreso.correo}`}
            className="shadow-4 border-round-lg mb-6"
          >
            <p className="text-lg font-semibold text-center">
              Total Generado:{" "}
              <Tag severity="success" value={`$${clienteMayorIngreso.totalIngresos.toFixed(2)}`} />
            </p>
          </Card>
        </motion.div>
      )}

      <Divider align="left">
        <span className="text-indigo-600 font-bold">Ingreso Total del Último Mes</span>
      </Divider>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-4 border-round-lg">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mt-4">
              ${ingresoUltimoMes.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-gray-500 mb-4">Ingresos acumulados en los últimos 30 días</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ReporteVentas;
