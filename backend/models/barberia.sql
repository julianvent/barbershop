DROP DATABASE IF EXISTS barberia;

CREATE DATABASE barberia;

USE barberia;
-- fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP y fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
CREATE TABLE cuenta (
    id_cuenta INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(100) NOT NULL UNIQUE,
    numero_telefonico VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL

);

CREATE TABLE barbero(
    id_barbero INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    path_foto VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE servicio(
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    duracion INT NOT NULL,
    tipo VARCHAR(50) NOT NULL
);

CREATE TABLE cita(
    id_cita INT AUTO_INCREMENT PRIMARY KEY,
    id_barbero INT NOT NULL,
    nombre_cliente VARCHAR(100) NOT NULL,
    numero_telefonico_cliente VARCHAR(15) NOT NULL,
    fecha_hora_cita DATETIME NOT NULL,
    duracion_total INT NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Reagendada', 'En curso', 'Finalizada', 'No realizada', 'Archivada', 'Atrasada') DEFAULT 'Pendiente',
    FOREIGN KEY (id_barbero) REFERENCES barbero(id_barbero)
    -- costo_Total?
);

CREATE TABLE servicio_cita(
    id_servicio INT NOT NULL,
    id_cita INT NOT NULL,
    costo DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cita) REFERENCES cita(id_cita),
    FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio)
);

CREATE TABLE horario(
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    horario_inicio TIME NOT NULL,
    horario_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    dia ENUM('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO')
);

CREATE TABLE fecha_inhabil(
    id_fecha_inhabil INT AUTO_INCREMENT PRIMARY KEY,
    motivo VARCHAR(100) NOT NULL,
    horario_inicio DATETIME NOT NULL,
    horario_fin DATETIME NOT NULL
);