-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: book_db
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `releaseAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coverUrl` varchar(255) NOT NULL,
  `userId` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_04f66cf2a34f8efc5dcd9803693` (`userId`),
  CONSTRAINT `FK_04f66cf2a34f8efc5dcd9803693` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (18,'description','alex','2025-03-14 23:00:00','https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/9d1e7a1d-0727-482f-b823-2863a5022d35-l6.jpeg',36,'2025-03-11 19:07:19.476691','2025-03-11 19:07:19.476691','Malus'),(19,'descr','lamal','2025-03-14 23:00:00','https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/4b20b38b-0446-4df0-bd96-9f0f576cc605-l6.jpeg',36,'2025-03-11 19:16:52.705534','2025-03-11 19:16:52.705534','Billy'),(20,'description','assa','2025-03-21 23:00:00','https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/ead4d9c9-30b3-44f2-addb-73a039ea6f81-l5.jpeg',36,'2025-03-11 19:17:34.844979','2025-03-11 19:17:34.844979','Bilase'),(21,'ds','alex','2025-03-20 23:00:00','https://my-uploadfilebucket.s3.eu-west-1.amazonaws.com/315d044b-9f45-40e1-bef8-62b70ef00d8b-l9.jpeg',36,'2025-03-12 11:55:52.045914','2025-03-12 11:55:52.045914','Bali');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `startAt` datetime NOT NULL,
  `endAt` datetime NOT NULL,
  `userId` int NOT NULL,
  `bookId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_336b3f4a235460dc93645fbf222` (`userId`),
  KEY `FK_9e9fe268de52aefa5e8156c30c3` (`bookId`),
  CONSTRAINT `FK_336b3f4a235460dc93645fbf222` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_9e9fe268de52aefa5e8156c30c3` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (4,'2025-03-12 12:04:38.640265','2025-03-22 23:00:00','2025-03-29 22:59:59',36,21);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,'dani','test pour l\'implémentation','djepeno.christopher@gmail.com');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `refreshToken` varchar(255) DEFAULT NULL,
  `sexe` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (36,'djepeno.christopher@gmail.com','$2b$10$8LkF1zf8Bb8jsQlW7MqLxe9fsNjee3shoUbj1Mr.pn4ktD91m8YiK','Djepeno','0666985656','2025-03-11 17:45:09.260514','2025-03-12 13:02:56.000000','$2b$10$30Kx0osQ2a23V1oWMGosCOmsvjf/o3MtIVGxQpGiVxcKKMzY4Qlq6','homme');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-17  9:41:36
