-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: inscripcion_talleres
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
INSERT INTO `inscripciones` VALUES (1,'wawa','papita@gmail.com',1,'2026-06-08 17:08:50','cancelada','2026-06-08 17:08:50','2026-06-15 07:14:12',2),(3,'wawa','papita@gmail.com',2,'2026-06-08 17:29:56','pendiente','2026-06-08 17:29:56','2026-06-08 17:29:56',2),(4,'Test User','testuser@ejemplo.com',1,'2026-06-15 03:46:00','cancelada','2026-06-15 03:46:00','2026-06-15 03:46:07',3),(5,'Test User','testuser@ejemplo.com',1,'2026-06-15 03:46:10','pendiente','2026-06-15 03:46:10','2026-06-15 03:46:10',3),(6,'Test User','testuser@ejemplo.com',2,'2026-06-15 03:46:15','pendiente','2026-06-15 03:46:15','2026-06-15 03:46:15',3),(7,'Juan Pérez','juan@correo.cl',3,'2026-06-15 04:37:18','confirmada','2026-06-15 04:37:18','2026-06-15 04:37:18',4),(8,'María Soto','maria@correo.cl',4,'2026-06-15 04:37:18','confirmada','2026-06-15 04:37:18','2026-06-15 04:37:18',5),(9,'Carlos Ruiz','carlos@correo.cl',3,'2026-06-15 04:37:18','pendiente','2026-06-15 04:37:18','2026-06-15 04:37:18',6),(10,'María Soto','maria@correo.cl',1,'2026-06-15 07:12:41','pendiente','2026-06-15 07:12:41','2026-06-15 07:12:41',5),(11,'Juan Pérez','juan@correo.cl',1,'2026-06-15 07:14:12','confirmada','2026-06-15 07:14:12','2026-06-15 07:14:12',4);
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lista_espera`
--

LOCK TABLES `lista_espera` WRITE;
/*!40000 ALTER TABLE `lista_espera` DISABLE KEYS */;
INSERT INTO `lista_espera` VALUES (1,4,1,'2026-06-15 07:12:56','aceptada','2026-06-15 07:12:56','2026-06-15 07:14:12');
/*!40000 ALTER TABLE `lista_espera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,2,'81d14bac81473ac5353881c35234488dfc291986d05880110713120b55d27ed1','2026-06-14 09:03:43',0,'2026-06-14 08:03:43','2026-06-14 08:03:43'),(2,3,'a39d97d3295aadd92505f628a2f8188c1a0c6f97b00e657deacae138920aad3b','2026-06-15 03:38:27',1,'2026-06-15 02:38:27','2026-06-15 02:39:02'),(3,3,'f22dedce77391246da5a2e509b375211dfad485bda89e41fb31d06e2f8d35524','2026-06-15 03:48:31',1,'2026-06-15 02:48:31','2026-06-15 03:05:18'),(4,3,'31b5be2ab6406c82809853a3c33b20bb8465bd7595b8cb5a1a03ff54348e3c14','2026-06-15 04:05:18',1,'2026-06-15 03:05:18','2026-06-15 03:05:48'),(5,3,'013527808552699062861a9ca4801947b484410c3143bbf3c868cc220a22aa9b','2026-06-15 04:17:45',1,'2026-06-15 03:17:45','2026-06-15 03:18:27');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `talleres`
--

LOCK TABLES `talleres` WRITE;
/*!40000 ALTER TABLE `talleres` DISABLE KEYS */;
INSERT INTO `talleres` VALUES (1,'Aprende a pintar','Aprende a desarrollar las técnicas de pintura con lápices de colores tradicional. Exploraremos sobreado, degradado y más técnicas. ','Kuschel Madrid',3,'2026-06-19','2026-06-20','activo','2026-06-08 17:04:13','2026-06-14 05:49:32','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8UqnXo9r95sXT9iTal3LGSTZai68dByYeeA&s','12:30:00','16:30:00',5000.00,0),(2,'Teatro de sombras','Se aprenderá a realizar interpretaciones con el cuerpo y figuras de papel para generar las sombras, al final del taller se presentará una pequeña obra como proyecto final.','Hugo Medina',5,'2026-06-13','2026-06-13','activo','2026-06-08 17:29:29','2026-06-08 18:22:06','https://images.adsttc.com/media/images/5858/461c/e58e/cebf/5700/0784/newsletter/152-2.jpg.jpg?1482180099','09:00:00','18:00:00',NULL,0),(3,'Taller de Pintura al Óleo','Aprende técnicas básicas de pintura al óleo: color, textura y composición.','María González',5,'2026-07-01','2026-07-03','activo','2026-06-15 04:37:18','2026-06-15 05:47:45','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv3DcGpFZbV5XvJK4dSvb7gOpFiKU4XFnGKvtqvQsRH7VD7apUjtuxsHn1&s=10','10:00:00','13:00:00',25000.00,0),(4,'Fotografía de Retrato','Domina la luz natural, encuadre y edición básica para retratos profesionales.','Carlos Muñoz',3,'2026-07-10','2026-07-12','activo','2026-06-15 04:37:18','2026-06-15 05:48:20','https://www.dzoom.org.es/wp-content/uploads/2019/10/portada-video-promo-curso-retrato-734x413.jpg','14:00:00','17:00:00',35000.00,0),(5,'Introducción a la Cerámica','Modelado a mano, torno básico y esmaltado para principiantes.','Ana Rivas',4,'2026-07-20','2026-07-22','activo','2026-06-15 04:37:18','2026-06-15 05:48:40','https://www.conasi.eu/blog/wp-content/uploads/2020/09/ceramica-y-porcelana-para-cocinar-1111-1.jpg','09:00:00','12:00:00',NULL,0),(6,'Gestión de Proyectos Ágiles','Scrum, Kanban y herramientas digitales para gestionar proyectos.','Pedro Soto',5,'2026-08-05','2026-08-07','activo','2026-06-15 04:37:18','2026-06-15 05:49:35','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQye-FxBlMHKDxztE1Lw9gqJquzQZpMaX_v4e37O_Mdc_nxyEl72iULLUaK&s=10','15:00:00','18:00:00',15000.00,0);
/*!40000 ALTER TABLE `talleres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'papita','papita@admin.com','$2b$10$yCOQ0dY.iaTf2PkPf.JXhO75flKPCShyRHaGTR4iRqkNX3BKzEIp6','admin','2026-06-08 16:43:25','2026-06-08 16:43:25'),(2,'wawa','papita@gmail.com','$2b$10$INUF1iM8FguQo2jvbI4uj.vCZYZHu79lYtVQXLwqG9EE9943KQG8e','usuario','2026-06-08 16:45:19','2026-06-08 16:45:19'),(3,'Test User','testuser@ejemplo.com','$2b$10$zg8evqxUIKAvWd8oYvBJv.VG5E79t5hpWuWutUhPy/eM24DqcAB/C','usuario','2026-06-15 02:38:22','2026-06-15 03:18:27'),(4,'Juan Pérez','juan@correo.cl','$2b$10$788BHY8ImLW3Tq2JMowL9uY9bTSR/wQFLnNEq1DNCZQFcgrXyXbL6','usuario','2026-06-15 04:37:18','2026-06-15 04:37:18'),(5,'María Soto','maria@correo.cl','$2b$10$788BHY8ImLW3Tq2JMowL9uY9bTSR/wQFLnNEq1DNCZQFcgrXyXbL6','usuario','2026-06-15 04:37:18','2026-06-15 04:37:18'),(6,'Carlos Ruiz','carlos@correo.cl','$2b$10$788BHY8ImLW3Tq2JMowL9uY9bTSR/wQFLnNEq1DNCZQFcgrXyXbL6','usuario','2026-06-15 04:37:18','2026-06-15 04:37:18');
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

-- Dump completed on 2026-06-15  4:40:41
