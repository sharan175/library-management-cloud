-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: library_db
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_code` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(200) NOT NULL,
  `total_copies` int NOT NULL,
  `available_copies` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `book_code` (`book_code`),
  CONSTRAINT `books_chk_1` CHECK ((`total_copies` >= 0)),
  CONSTRAINT `books_chk_2` CHECK ((`available_copies` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'B001','Introduction to Algorithms','Thomas H. Cormen',13,9,'2026-02-17 17:12:42'),(2,'B002','Clean Code','Robert C. Martin',8,8,'2026-02-17 17:12:42'),(3,'B003','The Pragmatic Programmer','Andrew Hunt',6,6,'2026-02-17 17:12:42'),(4,'B004','Database System Concepts','Abraham Silberschatz',12,12,'2026-02-17 17:12:42'),(5,'B005','Operating System Concepts','Galvin, Gagne, Silberschatz',9,9,'2026-02-17 17:12:42'),(6,'B102','Relationship Advice','Saqib',0,0,'2026-02-17 19:51:58');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrow`
--

DROP TABLE IF EXISTS `borrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `borrow_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `returned` enum('yes','no') NOT NULL DEFAULT 'no',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `borrow_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `borrow_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrow`
--

LOCK TABLES `borrow` WRITE;
/*!40000 ALTER TABLE `borrow` DISABLE KEYS */;
INSERT INTO `borrow` VALUES (1,1,1,'2026-02-17','2026-02-18','yes','2026-02-17 17:52:06'),(2,12,1,'2026-03-10','2026-02-25','no','2026-02-17 17:58:28'),(3,12,1,'2026-03-10','2026-02-25','no','2026-02-17 17:58:34'),(4,12,1,'2026-03-10','2026-03-25','no','2026-02-17 17:58:58'),(5,2,1,'2026-02-17','2026-02-18','yes','2026-02-17 18:25:33'),(6,16,1,'2026-02-18','2026-02-18','yes','2026-02-17 19:40:08'),(7,16,1,'2026-02-18','2026-02-25','no','2026-02-17 19:40:52'),(8,11,1,'2026-02-16','2026-02-18','yes','2026-02-17 19:42:05');
/*!40000 ALTER TABLE `borrow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sharan','sharan1','sharan1@gmail.com','123456','student','2026-02-17 14:33:22'),(2,'Sharan','1DA23CS158','sharan85444@gmail.com','Ojaspro@','student','2026-02-17 14:37:10'),(4,'Test User','test999','test999@gmail.com','123456','student','2026-02-17 15:07:06'),(9,'Test User','test2','test@gmail.com','123456','student','2026-02-17 15:19:02'),(11,'Vignesh','1DA23CS193','vignesh@gmail.com','hello12345','student','2026-02-17 15:20:32'),(12,'Sharan','1Da23me','vignesh12@gmail.com','helloworld','student','2026-02-17 15:26:05'),(13,'Sujan','1DA23CS174','SujanBhat@gmail.com','Heloow12345','student','2026-02-17 15:30:08'),(15,'ojas','1Da23me124','abcd@gmail.com','efergrtg','student','2026-02-17 15:57:19'),(16,'Saqib','1DA23CS177','saqib@gmail.com','saqib123','student','2026-02-17 19:39:01'),(19,'Sharan','1DA23MECC','abcde@123','index345','student','2026-02-17 20:19:44'),(20,'Sharan','1me','s@gmail.com','hellow','student','2026-03-03 19:00:27'),(22,'ojas','ddcd','o@gmail.com','abcde','student','2026-04-05 07:53:11'),(23,'ojas','ddddd','ob@gmail.com','abcd','student','2026-04-05 07:53:42');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05 14:03:04
