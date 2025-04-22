-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: escuelaDB
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id_asistencia` varchar(40) NOT NULL,
  `empleado` varchar(12) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time NOT NULL,
  `hora_salida` time DEFAULT NULL,
  `encargado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_asistencia`),
  KEY `fk_empleado` (`empleado`),
  KEY `fk_encargado` (`encargado`),
  CONSTRAINT `fk_empleado` FOREIGN KEY (`empleado`) REFERENCES `empleados` (`cedula`) ON UPDATE CASCADE,
  CONSTRAINT `fk_encargado` FOREIGN KEY (`encargado`) REFERENCES `usuarios` (`usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencias`
--

LOCK TABLES `asistencias` WRITE;
/*!40000 ALTER TABLE `asistencias` DISABLE KEYS */;
INSERT INTO `asistencias` VALUES ('30451822_2025421','30451822','2025-04-21','14:26:12',NULL,'alexis'),('31273899_2025420','31273899','2025-04-20','17:37:26','17:38:07','alexis'),('8933618_2025418','8933618','2025-04-18','13:12:40',NULL,'alexis'),('8933618_2025421','8933618','2025-04-21','14:45:08','15:37:17','alexis'),('8933618_2025422','8933618','2025-04-22','11:38:06','11:40:14','alexis');
/*!40000 ALTER TABLE `asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobantes`
--

DROP TABLE IF EXISTS `comprobantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobantes` (
  `id_justificacion` char(40) NOT NULL,
  `path` text NOT NULL,
  `id_comprobante` char(40) NOT NULL,
  PRIMARY KEY (`id_justificacion`,`id_comprobante`),
  CONSTRAINT `fk_justificativo` FOREIGN KEY (`id_justificacion`) REFERENCES `justificaciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobantes`
--

LOCK TABLES `comprobantes` WRITE;
/*!40000 ALTER TABLE `comprobantes` DISABLE KEYS */;
INSERT INTO `comprobantes` VALUES ('194bab22-a9cf-43c4-890b-09a0b98bae89','/comprobantes/photo_4907031875944558467_y.jpg','e8dd251d-14d8-4301-8bc5-ef0a8a0a67ee'),('7858bcc4-4854-48bb-a8a2-a395665fb061','/comprobantes/31273899-cGhvdG9f.jpg','6eaec7aa-2fe5-4f4c-b4dc-91b939cfe13e');
/*!40000 ALTER TABLE `comprobantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id_departamento` varchar(40) NOT NULL,
  `nombre_departamento` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `icon` varchar(120) NOT NULL,
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES ('0f26-e789-9715-9835','Administrativos','Personal administrativo y dependencias.','fa-solid fa-building');
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `cedula` varchar(12) NOT NULL,
  `primer_nombre` text NOT NULL,
  `segundo_nombre` text,
  `primer_apellido` text NOT NULL,
  `segundo_apellido` text,
  `sexo` varchar(25) NOT NULL,
  `edad` varchar(2) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `departamento` varchar(40) DEFAULT 'No Asignado',
  `cargo` varchar(100) NOT NULL,
  `turno` varchar(20) NOT NULL,
  `estado` varchar(25) NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nacionalidad` varchar(45) NOT NULL DEFAULT 'Venezolano',
  PRIMARY KEY (`cedula`),
  KEY `fk_departamento` (`departamento`),
  CONSTRAINT `fk_departamento` FOREIGN KEY (`departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `empleados_chk_1` CHECK ((`sexo` in (_utf8mb4'Masculino',_utf8mb4'Femenino'))),
  CONSTRAINT `empleados_chk_2` CHECK ((`turno` in (_utf8mb4'Mañana',_utf8mb4'Tarde'))),
  CONSTRAINT `empleados_chk_3` CHECK ((`estado` in (_utf8mb4'Activo',_utf8mb4'Reposo',_utf8mb4'Inhabilitado',_utf8mb4'Despedido',_utf8mb4'No Asignado')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES ('30451822','Carla','Coromoto','Gimon','Rodriguez','Femenino','22','2003-02-09','0f26-e789-9715-9835','Administradora','Mañana','Activo','2025-04-17 14:34:15','Extranjero'),('31273899','Marines','Alessandra','Zamora','Gragirene','Femenino','20','2005-04-14','0f26-e789-9715-9835','Administradora','Mañana','Activo','2025-04-20 21:34:19','Venezolano'),('7829839','Josefina','Coromoto','Perez','Gragirene','Femenino','31','1992-05-02','0f26-e789-9715-9835','Docente de Castellano','Tarde','Activo','2025-04-21 23:42:22','Extranjero'),('8933618','Zulevia','Coromoto','Gimon','Velandre','Femenino','61','1962-08-22','0f26-e789-9715-9835','Administradora Encargada','Mañana','Activo','2025-04-17 14:05:22','Venezolano');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `info_contacto`
--

DROP TABLE IF EXISTS `info_contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_contacto` (
  `id_empleado` varchar(12) NOT NULL,
  `direccion_habitacion` varchar(250) DEFAULT NULL,
  `telefono_personal` varchar(20) DEFAULT NULL,
  `telefono_habitacion` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL,
  KEY `fk_empleado_contacto` (`id_empleado`),
  CONSTRAINT `fk_empleado_contacto` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info_contacto`
--

LOCK TABLES `info_contacto` WRITE;
/*!40000 ALTER TABLE `info_contacto` DISABLE KEYS */;
INSERT INTO `info_contacto` VALUES ('30451822','Urb. Los Proceres, Manzana 19 Casa #12, Ciudad Bolivar, Estado Bolivar','04129939328','0285999239','carlosrafa@gmail.com');
/*!40000 ALTER TABLE `info_contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `info_laboral`
--

DROP TABLE IF EXISTS `info_laboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_laboral` (
  `id_empleado` varchar(12) NOT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `tiempo_servicio` varchar(30) DEFAULT NULL,
  `hora_entrada` varchar(30) DEFAULT NULL,
  `hora_salida` varchar(30) DEFAULT NULL,
  KEY `fk_empleado_laboral` (`id_empleado`),
  CONSTRAINT `fk_empleado_laboral` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info_laboral`
--

LOCK TABLES `info_laboral` WRITE;
/*!40000 ALTER TABLE `info_laboral` DISABLE KEYS */;
INSERT INTO `info_laboral` VALUES ('8933618','2023-06-16','1 año','07:00','16:00'),('30451822','2015-02-01','10 años','07:00','12:00'),('31273899','2020-04-20','5 años','06:00','12:00'),('7829839','2025-02-02','2 meses',NULL,NULL);
/*!40000 ALTER TABLE `info_laboral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `info_personal`
--

DROP TABLE IF EXISTS `info_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info_personal` (
  `id_empleado` varchar(12) NOT NULL,
  `estado_civil` varchar(20) DEFAULT NULL,
  `nivel_academico` varchar(70) DEFAULT NULL,
  KEY `fk_empleado_personal` (`id_empleado`),
  CONSTRAINT `fk_empleado_personal` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info_personal`
--

LOCK TABLES `info_personal` WRITE;
/*!40000 ALTER TABLE `info_personal` DISABLE KEYS */;
INSERT INTO `info_personal` VALUES ('30451822','Divorciado(a)','Tecnico Superior'),('31273899','Soltero(a)','Bachiller');
/*!40000 ALTER TABLE `info_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificaciones`
--

DROP TABLE IF EXISTS `justificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificaciones` (
  `empleado` varchar(12) DEFAULT NULL,
  `id` char(40) NOT NULL,
  `tipo` text,
  `detalles` text,
  `fecha_inicio` text,
  `fecha_finalizacion` text,
  PRIMARY KEY (`id`),
  KEY `fk_empleado3` (`empleado`),
  CONSTRAINT `fk_empleado3` FOREIGN KEY (`empleado`) REFERENCES `empleados` (`cedula`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificaciones`
--

LOCK TABLES `justificaciones` WRITE;
/*!40000 ALTER TABLE `justificaciones` DISABLE KEYS */;
INSERT INTO `justificaciones` VALUES ('30451822','194bab22-a9cf-43c4-890b-09a0b98bae89','Permiso','','2025-04-01','2025-04-30'),('31273899','7858bcc4-4854-48bb-a8a2-a395665fb061','Reposo','','2024-02-02','2025-02-02');
/*!40000 ALTER TABLE `justificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observaciones_asistencias`
--

DROP TABLE IF EXISTS `observaciones_asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `observaciones_asistencias` (
  `id_asistencia` varchar(40) NOT NULL,
  `encargado_observacion` varchar(50) NOT NULL,
  `tipo_observacion` varchar(12) NOT NULL,
  `observacion` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `fk_asistencia` (`id_asistencia`),
  CONSTRAINT `fk_asistencia` FOREIGN KEY (`id_asistencia`) REFERENCES `asistencias` (`id_asistencia`) ON UPDATE CASCADE,
  CONSTRAINT `observaciones_asistencias_chk_1` CHECK ((`tipo_observacion` in (_utf8mb4'Entrada',_utf8mb4'Salida',_utf8mb4'General')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observaciones_asistencias`
--

LOCK TABLES `observaciones_asistencias` WRITE;
/*!40000 ALTER TABLE `observaciones_asistencias` DISABLE KEYS */;
INSERT INTO `observaciones_asistencias` VALUES ('8933618_2025421','alexis','General','Un mamut cihquitito queria volar','2025-04-21 23:38:25'),('30451822_2025421','alexis','General','nueva','2025-04-22 01:12:00'),('8933618_2025422','alexis','Salida','La salida fue antes de lo esperado por problemas de salud','2025-04-22 15:38:51');
/*!40000 ALTER TABLE `observaciones_asistencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `usuario` varchar(50) NOT NULL,
  `preg_1` text NOT NULL,
  `res_1` text NOT NULL,
  `preg_2` text NOT NULL,
  `res_2` text NOT NULL,
  KEY `fk_usuario` (`usuario`),
  CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES ('alexis','Comida Favorita','Arroz','Pelicula Favorita','Titanic');
/*!40000 ALTER TABLE `preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `usuario` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  `data` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_session` (`usuario`),
  CONSTRAINT `fk_usuario_session` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('20e5-a2fa-8f23-0dc3','alexis','2025-04-20 21:33:09','2025-04-21 00:33:09','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('2474-83d9-f7f7-33ac','alexis','2025-04-17 21:42:29','2025-04-18 00:42:30','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('2dda-4636-c134-8345','alexis','2025-04-21 18:24:24','2025-04-21 21:24:25','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('6203-0ec7-929a-e4ed','alexis','2025-04-20 21:33:07','2025-04-21 00:33:07','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('6f8d-fd51-e1c6-d9a2','alexis','2025-04-22 15:35:55','2025-04-22 18:35:56','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('ac12-07ba-7aec-e209','alexis','2025-04-20 21:33:08','2025-04-21 00:33:08','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('df58-481f-ca17-095e','alexis','2025-04-20 21:33:07','2025-04-21 00:33:07','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('e0ec-f220-8928-09ac','alexis','2025-04-20 21:33:08','2025-04-21 00:33:08','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('fc99-6e66-4718-a646','alexis','2025-04-20 21:33:07','2025-04-21 00:33:08','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}'),('fe2b-f98e-9b27-fe15','alexis','2025-04-20 21:33:08','2025-04-21 00:33:08','{\"role\": \"Superadmin\", \"estado\": \"Activo\", \"nombre\": \"Alexis\", \"usuario\": \"alexis\", \"apellido\": \"Camacho\", \"created_at\": \"2025-02-23T03:46:16.000Z\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `nombre` text NOT NULL,
  `apellido` text NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contraseña` text NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Usuario',
  `estado` varchar(50) NOT NULL DEFAULT 'Activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario`),
  UNIQUE KEY `usuario` (`usuario`),
  CONSTRAINT `usuarios_chk_1` CHECK ((`estado` in (_utf8mb4'Activo',_utf8mb4'Bloqueado')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('Alexis','Camacho','alexis','$2b$10$AEcem8aZQr0.E1k7CggU9OcFCSSfi703oCInjWUj4ZCWNKu/My1B6','Superadmin','Activo','2025-02-23 03:46:16');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-22 11:55:59
