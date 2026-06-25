CREATE DATABASE IF NOT EXISTS talentcloud_db;
USE talentcloud_db;

-- Tabla de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nit VARCHAR(50) NOT NULL UNIQUE,
    nombre_empresa VARCHAR(150) NOT NULL,
    sitio_web VARCHAR(255),
    sector_industrial VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios (candidatos y reclutadores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Candidato', 'Reclutador', 'Admin') NOT NULL DEFAULT 'Candidato',
    empresa_id INT DEFAULT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
);

-- Tabla de vacantes
CREATE TABLE IF NOT EXISTS vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reclutador_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion_puesto TEXT,
    modalidad ENUM('Remoto', 'Presencial', 'Hibrido') NOT NULL,
    salario_ofrecido DECIMAL(10, 2),
    estado ENUM('Abierta', 'Cerrada', 'Pausada') DEFAULT 'Abierta',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reclutador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Opcional: Insertar datos de prueba para verificar que la API funcione de inmediato
INSERT INTO empresas (nit, nombre_empresa, sitio_web, sector_industrial) VALUES
('900123456-1', 'Tech Solutions SAS', 'www.techsolutions.com', 'Tecnología');

INSERT INTO usuarios (nombre, email, password_hash, rol, empresa_id) VALUES
('Admin', 'admin@talentcloud.com', 'hashed_password_123', 'Admin', NULL),
('Juan Reclutador', 'juan@techsolutions.com', 'hashed_password_456', 'Reclutador', 1);

INSERT INTO vacantes (reclutador_id, titulo, descripcion_puesto, modalidad, salario_ofrecido) VALUES
(2, 'Desarrollador Backend Node.js', 'Desarrollo de APIs en Node y Express', 'Remoto', 4500000.00),
(2, 'Desarrollador Frontend React', 'Creación de interfaces web interactivas', 'Hibrido', 4000000.00);
