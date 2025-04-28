
-- Prueba tecnica Miguel Amaya 
-- Full Stack Developer SIMAN
-- CREACIÓN DE LAS TABLAS
-- Por si existe alguna tabla con el mismo nombre, la eliminamos
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS ventas CASCADE;
DROP TABLE IF EXISTS detalle_ventas CASCADE;
DROP TABLE IF EXISTS bitacora CASCADE;
DROP TABLE IF EXISTS usuarios_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;



-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL, 
    activo BOOLEAN DEFAULT true
);
-- Tabla de roles
CREATE TABLE roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE  -- 'ADMIN', 'OPERADOR'
);

-- Tabla usuarios_roles ( muchos a muchos)
CREATE TABLE usuarios_roles (
    usuario_id INT NOT NULL,
    rol_id INT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

--tabla productos, clientes, ventas y detalle_ventas
CREATE TABLE productos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE clientes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE ventas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id INT NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE detalle_ventas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
--tabla bitacora
CREATE TABLE bitacora (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    id_entidad INT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Creamos la tabla refresh_tokens
CREATE TABLE refresh_tokens (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,               -- El token de renovación (string largo)
    usuario_id INT NOT NULL,                          -- FK hacia la tabla usuarios
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Cuándo se creó el token
    fecha_expiracion TIMESTAMP NOT NULL,              -- Hasta cuándo es válido el token
    usado BOOLEAN DEFAULT FALSE,                      -- Si ya fue usado o invalidado
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
-- FUNCION PARA TRIGGERS DE BITACORA
CREATE OR REPLACE FUNCTION registrar_bitacora()
RETURNS TRIGGER AS $$
DECLARE
    id_afectado INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        id_afectado := OLD.id;
    ELSE
        id_afectado := NEW.id;
    END IF;
    -- Insertamos el registro en la tabla de bitácora
    INSERT INTO bitacora (usuario, accion, entidad, id_entidad)
    VALUES (current_user, TG_OP, TG_TABLE_NAME, id_afectado);
    -- Retornamos el registro adecuado según la operación que se haya seleccionado
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

--TRIGGERS PARA CADA TABLA

-- Trigger para productos
CREATE TRIGGER trg_productos_bitacora
AFTER INSERT OR UPDATE OR DELETE
ON productos
FOR EACH ROW
EXECUTE FUNCTION registrar_bitacora();

-- Trigger para clientes
CREATE TRIGGER trg_clientes_bitacora
AFTER INSERT OR UPDATE OR DELETE
ON clientes
FOR EACH ROW
EXECUTE FUNCTION registrar_bitacora();

-- Trigger para ventas
CREATE TRIGGER trg_ventas_bitacora
AFTER INSERT OR UPDATE OR DELETE
ON ventas
FOR EACH ROW
EXECUTE FUNCTION registrar_bitacora();

