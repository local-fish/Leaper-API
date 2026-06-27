-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: softarch
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.2

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
-- Current Database: `softarch`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `softarch` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `softarch`;

--
-- Table structure for table `Assessment`
--

DROP TABLE IF EXISTS `Assessment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assessment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `instruction` varchar(4000) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Assessment_courseId_fkey` (`courseId`),
  CONSTRAINT `Assessment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assessment`
--

LOCK TABLES `Assessment` WRITE;
/*!40000 ALTER TABLE `Assessment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Assessment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentGrade`
--

DROP TABLE IF EXISTS `AssessmentGrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssessmentGrade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `userId` int NOT NULL,
  `grade` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AssessmentGrade_assessmentId_fkey` (`assessmentId`),
  KEY `AssessmentGrade_userId_fkey` (`userId`),
  CONSTRAINT `AssessmentGrade_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assessment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AssessmentGrade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentGrade`
--

LOCK TABLES `AssessmentGrade` WRITE;
/*!40000 ALTER TABLE `AssessmentGrade` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentGrade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentQuesiton`
--

DROP TABLE IF EXISTS `AssessmentQuesiton`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssessmentQuesiton` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `revision` int NOT NULL,
  `data` longblob NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AssessmentQuesiton_revision_idx` (`revision`),
  KEY `AssessmentQuesiton_assessmentId_fkey` (`assessmentId`),
  CONSTRAINT `AssessmentQuesiton_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assessment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentQuesiton`
--

LOCK TABLES `AssessmentQuesiton` WRITE;
/*!40000 ALTER TABLE `AssessmentQuesiton` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentQuesiton` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AssessmentSubmission`
--

DROP TABLE IF EXISTS `AssessmentSubmission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AssessmentSubmission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assessmentId` int NOT NULL,
  `questionId` int NOT NULL,
  `userId` int NOT NULL,
  `data` longblob NOT NULL,
  `grade` double DEFAULT NULL,
  `submitted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `AssessmentSubmission_assessmentId_fkey` (`assessmentId`),
  KEY `AssessmentSubmission_questionId_fkey` (`questionId`),
  KEY `AssessmentSubmission_userId_fkey` (`userId`),
  CONSTRAINT `AssessmentSubmission_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assessment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AssessmentSubmission_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `AssessmentQuesiton` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `AssessmentSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AssessmentSubmission`
--

LOCK TABLES `AssessmentSubmission` WRITE;
/*!40000 ALTER TABLE `AssessmentSubmission` DISABLE KEYS */;
/*!40000 ALTER TABLE `AssessmentSubmission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course`
--

DROP TABLE IF EXISTS `Course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course`
--

LOCK TABLES `Course` WRITE;
/*!40000 ALTER TABLE `Course` DISABLE KEYS */;
INSERT INTO `Course` VALUES (235,'Data Structures'),(236,'Chemistry'),(237,'Computational Physics'),(238,'Computational Biology'),(239,'Database'),(240,'Algorithm and Programming'),(241,'Theory of Computation'),(242,'Linear Algebra'),(243,'Mobile Programming'),(244,'Refactoring'),(245,'Software Engineering'),(246,'Software Architecture');
/*!40000 ALTER TABLE `Course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseGrade`
--

DROP TABLE IF EXISTS `CourseGrade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseGrade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `compid` int NOT NULL,
  `userId` int NOT NULL,
  `grade` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CourseGrade_compid_fkey` (`compid`),
  KEY `CourseGrade_userId_fkey` (`userId`),
  CONSTRAINT `CourseGrade_compid_fkey` FOREIGN KEY (`compid`) REFERENCES `CourseGradeComp` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CourseGrade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3423 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseGrade`
--

LOCK TABLES `CourseGrade` WRITE;
/*!40000 ALTER TABLE `CourseGrade` DISABLE KEYS */;
INSERT INTO `CourseGrade` VALUES (3229,832,9910,58),(3230,832,9901,68),(3231,842,9913,12),(3232,842,9901,23),(3233,842,9900,38),(3234,842,9912,51),(3235,837,9909,30),(3236,837,9906,47),(3237,837,9905,21),(3238,837,9903,42),(3239,847,9902,97),(3240,847,9903,34),(3241,847,9905,97),(3242,847,9900,18),(3243,852,9900,58),(3244,852,9910,15),(3245,852,9901,44),(3246,852,9904,99),(3247,852,9908,60),(3248,852,9909,76),(3249,861,9913,89),(3250,861,9909,40),(3251,861,9906,52),(3252,857,9909,41),(3253,857,9911,30),(3254,855,9912,68),(3255,855,9907,84),(3256,866,9900,18),(3257,866,9905,30),(3258,866,9909,75),(3259,866,9904,77),(3260,833,9910,45),(3261,833,9913,22),(3262,833,9903,71),(3263,833,9901,76),(3264,833,9907,74),(3265,871,9900,13),(3266,871,9902,85),(3267,871,9912,71),(3268,871,9999,26),(3269,871,9909,44),(3270,834,9901,26),(3271,834,9902,79),(3272,834,9903,93),(3273,834,9907,38),(3274,836,9913,24),(3275,836,9910,95),(3276,836,9901,40),(3277,836,9903,68),(3278,836,9907,49),(3279,835,9907,39),(3280,835,9910,87),(3281,835,9902,83),(3282,835,9901,45),(3283,835,9913,41),(3284,835,9903,60),(3285,873,9999,90),(3286,873,9904,89),(3287,873,9912,90),(3288,873,9902,95),(3289,878,9906,65),(3290,878,9913,24),(3291,878,9901,94),(3292,878,9908,85),(3293,843,9900,49),(3294,843,9912,85),(3295,843,9901,32),(3296,843,9913,88),(3297,844,9900,38),(3298,844,9912,18),(3299,844,9913,21),(3300,844,9901,64),(3301,845,9901,95),(3302,845,9913,28),(3303,845,9912,64),(3304,846,9901,30),(3305,846,9912,70),(3306,846,9913,18),(3307,846,9900,97),(3308,838,9909,16),(3309,838,9906,26),(3310,838,9907,78),(3311,838,9905,46),(3312,838,9903,36),(3313,839,9909,17),(3314,839,9905,30),(3315,840,9907,58),(3316,840,9903,66),(3317,841,9905,41),(3318,841,9903,82),(3319,841,9909,71),(3320,841,9907,18),(3321,848,9900,18),(3322,848,9905,24),(3323,848,9903,87),(3324,848,9902,67),(3325,849,9902,83),(3326,849,9905,80),(3327,849,9900,73),(3328,849,9903,32),(3329,850,9902,92),(3330,850,9900,37),(3331,850,9903,28),(3332,850,9905,30),(3333,851,9902,23),(3334,851,9905,54),(3335,851,9900,68),(3336,851,9903,76),(3337,853,9907,28),(3338,853,9910,46),(3339,853,9909,66),(3340,853,9901,87),(3341,853,9900,30),(3342,853,9908,65),(3343,853,9904,19),(3344,854,9910,11),(3345,854,9904,95),(3346,854,9900,44),(3347,854,9909,27),(3348,854,9907,99),(3349,854,9908,75),(3350,854,9901,76),(3351,856,9907,92),(3352,856,9905,58),(3353,856,9902,68),(3354,856,9903,79),(3355,862,9906,41),(3356,862,9907,18),(3357,863,9908,52),(3358,863,9902,49),(3359,863,9906,32),(3360,864,9907,27),(3361,864,9908,94),(3362,864,9902,69),(3363,864,9913,19),(3364,864,9909,66),(3365,864,9906,21),(3366,865,9907,80),(3367,865,9906,85),(3368,865,9913,11),(3369,858,9905,90),(3370,858,9904,80),(3371,858,9907,55),(3372,858,9900,13),(3373,859,9911,76),(3374,859,9910,63),(3375,859,9903,54),(3376,859,9905,71),(3377,860,9904,41),(3378,860,9909,32),(3379,860,9911,35),(3380,860,9903,11),(3381,860,9910,35),(3382,860,9907,50),(3383,860,9905,60),(3384,867,9900,94),(3385,867,9904,56),(3386,868,9911,54),(3387,868,9900,93),(3388,868,9905,15),(3389,868,9904,19),(3390,868,9909,21),(3391,868,9913,19),(3392,869,9905,87),(3393,869,9900,75),(3394,869,9913,92),(3395,870,9904,49),(3396,870,9913,84),(3397,870,9911,43),(3398,870,9905,56),(3399,870,9909,49),(3400,870,9900,10),(3401,872,9909,20),(3402,872,9999,58),(3403,872,9902,99),(3404,872,9900,38),(3405,872,9912,66),(3406,874,9912,79),(3407,874,9905,40),(3408,874,9999,45),(3409,875,9999,45),(3410,875,9904,62),(3411,875,9912,13),(3412,876,9908,95),(3413,876,9902,90),(3414,876,9904,44),(3415,877,9908,54),(3416,877,9999,69),(3417,877,9912,33),(3418,877,9904,19),(3419,879,9910,12),(3420,879,9906,32),(3421,879,9908,99),(3422,879,9901,21);
/*!40000 ALTER TABLE `CourseGrade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseGradeComp`
--

DROP TABLE IF EXISTS `CourseGradeComp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseGradeComp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CourseGradeComp_courseId_fkey` (`courseId`),
  CONSTRAINT `CourseGradeComp_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=880 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseGradeComp`
--

LOCK TABLES `CourseGradeComp` WRITE;
/*!40000 ALTER TABLE `CourseGradeComp` DISABLE KEYS */;
INSERT INTO `CourseGradeComp` VALUES (832,'Mid',238),(833,'Final',238),(834,'Lab',238),(835,'Assignment',238),(836,'Quiz',238),(837,'Final',236),(838,'Lab',236),(839,'Assignment',236),(840,'Quiz',236),(841,'Mid',236),(842,'Final',235),(843,'Assignment',235),(844,'Mid',235),(845,'Quiz',235),(846,'Lab',235),(847,'Assignment',239),(848,'Final',239),(849,'Quiz',239),(850,'Mid',239),(851,'Lab',239),(852,'Assignment',237),(853,'Lab',237),(854,'Quiz',237),(855,'Quiz',242),(856,'Assignment',242),(857,'Quiz',240),(858,'Lab',240),(859,'Assignment',240),(860,'Final',240),(861,'Final',241),(862,'Assignment',241),(863,'Quiz',241),(864,'Lab',241),(865,'Mid',241),(866,'Quiz',243),(867,'Mid',243),(868,'Final',243),(869,'Assignment',243),(870,'Lab',243),(871,'Assignment',244),(872,'Final',244),(873,'Lab',246),(874,'Assignment',246),(875,'Final',246),(876,'Quiz',246),(877,'Mid',246),(878,'Final',245),(879,'Mid',245);
/*!40000 ALTER TABLE `CourseGradeComp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseSession`
--

DROP TABLE IF EXISTS `CourseSession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseSession` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `topic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionNo` int NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CourseSession_startTime_endTime_idx` (`startTime`,`endTime`),
  KEY `CourseSession_courseId_fkey` (`courseId`),
  CONSTRAINT `CourseSession_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseSession`
--

LOCK TABLES `CourseSession` WRITE;
/*!40000 ALTER TABLE `CourseSession` DISABLE KEYS */;
INSERT INTO `CourseSession` VALUES (2233,238,'Introduction to Computational Biology',1,'2026-07-13 07:13:24.236','2026-07-13 12:13:24.236','C117'),(2234,238,'Genomics',2,'2026-07-18 11:13:24.236','2026-07-18 14:13:24.236','B113'),(2235,238,'Proteomics',3,'2026-07-22 11:13:24.236','2026-07-22 12:13:24.236','B115'),(2236,238,'DNA sequencing',4,'2026-07-29 04:13:24.236','2026-07-29 09:13:24.236','C110'),(2237,238,'DNA mutation',5,'2026-08-03 07:13:24.236','2026-08-03 12:13:24.236','B111'),(2238,238,'Bioinformatics',6,'2026-08-10 14:13:24.236','2026-08-09 18:13:24.236','B112'),(2239,238,'Sequence Alignment',7,'2026-08-15 01:13:24.236','2026-08-15 04:13:24.236','B109'),(2240,238,'Molecular Evolution',8,'2026-08-21 05:13:24.236','2026-08-21 06:13:24.236','A114'),(2241,236,'Introduction to Chemistry',1,'2026-07-10 01:34:32.644','2026-07-10 02:34:32.644','B109'),(2242,236,'Acid and Base',2,'2026-07-13 14:34:32.644','2026-07-13 15:34:32.644','D108'),(2243,236,'Molecule',3,'2026-07-17 19:34:32.644','2026-07-18 00:34:32.644','C101'),(2244,236,'Compound',4,'2026-07-24 13:34:32.644','2026-07-24 14:34:32.644','A110'),(2245,236,'IUPAC',5,'2026-07-29 20:34:32.644','2026-07-29 23:34:32.644','A101'),(2246,236,'Electrolysis',6,'2026-08-04 10:34:32.644','2026-08-04 13:34:32.644','D101'),(2247,236,'Chemical Reaction',7,'2026-08-06 13:34:32.644','2026-08-06 17:34:32.644','A107'),(2248,236,'Colligative Properties',8,'2026-08-12 15:34:32.644','2026-08-12 19:34:32.644','C117'),(2249,236,'Colloid',9,'2026-08-18 09:34:32.644','2026-08-18 10:34:32.644','A108'),(2250,236,'Oxidation',10,'2026-08-22 06:34:32.644','2026-08-22 08:34:32.644','C111'),(2251,236,'Reduction',11,'2026-08-25 01:34:32.644','2026-08-25 03:34:32.644','D115'),(2252,239,'Introduction to Database',1,'2026-07-19 20:11:42.734','2026-07-19 00:11:42.734','B110'),(2253,239,'Relational Model',2,'2026-07-21 22:11:42.734','2026-07-22 03:11:42.734','D110'),(2254,239,'Relational Algebra',3,'2026-07-27 11:11:42.734','2026-07-27 15:11:42.734','B117'),(2255,239,'Relational Calculus',4,'2026-08-02 20:11:42.734','2026-08-02 22:11:42.734','D101'),(2256,239,'Schema Refinement',5,'2026-08-09 20:11:42.734','2026-08-10 01:11:42.734','C103'),(2257,239,'Normal Forms',6,'2026-08-14 03:11:42.734','2026-08-14 05:11:42.734','D111'),(2258,239,'SQL',7,'2026-08-19 07:11:42.734','2026-08-19 12:11:42.734','C114'),(2259,239,'Advanced SQL',8,'2026-08-21 17:11:42.734','2026-08-21 22:11:42.734','C107'),(2260,239,'Transaction',9,'2026-08-24 19:11:42.734','2026-08-24 22:11:42.734','A112'),(2261,239,'Concurrency',10,'2026-08-28 05:11:42.734','2026-08-28 10:11:42.734','B119'),(2262,235,'Introduction to Data Structures',1,'2026-07-04 06:07:34.274','2026-07-04 10:07:34.274','D108'),(2263,235,'Linked List',2,'2026-07-10 19:07:34.274','2026-07-10 21:07:34.274','A119'),(2264,235,'Hash Map',3,'2026-07-14 13:07:34.274','2026-07-14 18:07:34.274','D109'),(2265,235,'Binary Tree',4,'2026-07-20 11:07:34.274','2026-07-19 12:07:34.274','C102'),(2266,235,'B-Tree',5,'2026-07-24 22:07:34.274','2026-07-25 00:07:34.274','C110'),(2267,235,'Red Black Tree',6,'2026-07-27 02:07:34.274','2026-07-27 05:07:34.274','A113'),(2268,235,'AVL Tree',7,'2026-08-03 12:07:34.274','2026-08-02 15:07:34.274','C115'),(2269,235,'Heaps',8,'2026-08-10 12:07:34.274','2026-08-09 17:07:34.274','A116'),(2270,235,'Graphs',9,'2026-08-14 09:07:34.274','2026-08-14 12:07:34.274','D117'),(2271,237,'Introduction to Computational Physics',1,'2026-07-01 08:09:21.054','2026-07-01 10:09:21.054','B117'),(2272,237,'Electric Charge',2,'2026-07-07 21:09:21.054','2026-07-07 23:09:21.054','C120'),(2273,237,'Voltage',3,'2026-07-12 23:09:21.054','2026-07-13 04:09:21.054','C116'),(2274,237,'Current',4,'2026-07-16 18:09:21.054','2026-07-16 23:09:21.054','B105'),(2275,237,'Resistance',5,'2026-07-22 07:09:21.054','2026-07-22 10:09:21.054','A103'),(2276,237,'Capacitance',6,'2026-07-28 15:09:21.054','2026-07-28 20:09:21.054','C101'),(2277,237,'Circuit',7,'2026-08-03 17:09:21.054','2026-08-03 18:09:21.054','B116'),(2278,237,'Magnetic Fields',8,'2026-08-06 01:09:21.054','2026-08-06 04:09:21.054','D118'),(2279,237,'Induction and Inductance',9,'2026-08-10 01:09:21.054','2026-08-09 05:09:21.054','A108'),(2280,242,'System of Linear Equations',1,'2026-06-29 16:34:27.229','2026-06-28 20:34:27.229','C104'),(2281,242,'Matrix',2,'2026-07-03 03:34:27.229','2026-07-03 08:34:27.229','C108'),(2282,242,'Vector',3,'2026-07-09 21:34:27.229','2026-07-10 00:34:27.229','C112'),(2283,242,'Eigenvalues and Eigenvectors',4,'2026-07-14 15:34:27.229','2026-07-14 18:34:27.229','D104'),(2284,242,'Linear Transformation',5,'2026-07-18 08:34:27.229','2026-07-18 10:34:27.229','B115'),(2285,240,'Introduction to Algorithm',1,'2026-07-13 12:12:23.820','2026-07-12 16:12:23.820','C103'),(2286,240,'Operator, Operand, Arithmetic',2,'2026-07-15 10:12:23.820','2026-07-15 14:12:23.820','D115'),(2287,240,'Pointer and Array',3,'2026-07-21 00:12:23.820','2026-07-21 02:12:23.820','B116'),(2288,240,'Functions',4,'2026-07-27 01:12:23.820','2026-07-27 04:12:23.820','A105'),(2289,240,'Recursions',5,'2026-08-03 00:12:23.820','2026-08-02 04:12:23.820','B116'),(2290,240,'Structures',6,'2026-08-06 22:12:23.820','2026-08-06 23:12:23.820','A109'),(2291,240,'Memory Allocation',7,'2026-08-12 01:12:23.820','2026-08-12 04:12:23.820','C117'),(2292,240,'File Processing',8,'2026-08-17 10:12:23.820','2026-08-16 14:12:23.820','A108'),(2293,240,'Sorting',9,'2026-08-22 00:12:23.820','2026-08-22 02:12:23.820','B118'),(2294,240,'Searching',10,'2026-08-24 05:12:23.820','2026-08-24 09:12:23.820','D103'),(2295,241,'Introduction to Theory of Computation',1,'2026-07-08 01:58:37.161','2026-07-08 02:58:37.161','A105'),(2296,241,'Automata Theory',2,'2026-07-14 10:58:37.161','2026-07-14 15:58:37.161','C116'),(2297,241,'Formal Proof',3,'2026-07-19 17:58:37.161','2026-07-18 19:58:37.161','B118'),(2298,241,'Inductive Proof',4,'2026-07-21 21:58:37.161','2026-07-22 01:58:37.161','D118'),(2299,241,'Central Concepts of Automata Theory',5,'2026-07-28 14:58:37.161','2026-07-28 17:58:37.161','A108'),(2300,241,'Finite Automata',6,'2026-08-04 12:58:37.161','2026-08-04 13:58:37.161','C112'),(2301,241,'DFA',7,'2026-08-09 20:58:37.161','2026-08-09 23:58:37.161','B113'),(2302,241,'NDFA',8,'2026-08-16 20:58:37.161','2026-08-16 22:58:37.161','A116'),(2303,241,'Regular Expressions',9,'2026-08-23 20:58:37.161','2026-08-23 22:58:37.161','A114'),(2304,241,'Context Free Grammars',10,'2026-08-26 14:58:37.161','2026-08-26 17:58:37.161','B105'),(2305,241,'Pushdown Automata',11,'2026-09-01 21:58:37.161','2026-09-02 00:58:37.161','A101'),(2306,241,'Undecidability',12,'2026-09-04 03:58:37.161','2026-09-04 06:58:37.161','B102'),(2307,241,'P and NP',13,'2026-09-06 23:58:37.161','2026-09-07 04:58:37.161','B104'),(2308,243,'Introduction to Mobile Rendering',1,'2026-07-03 13:52:38.639','2026-07-03 16:52:38.639','B108'),(2309,243,'Flutter',2,'2026-07-10 03:52:38.639','2026-07-10 05:52:38.639','D117'),(2310,243,'Widget',3,'2026-07-14 13:52:38.639','2026-07-14 16:52:38.639','C102'),(2311,243,'Stateful Widget',4,'2026-07-20 15:52:38.639','2026-07-19 18:52:38.639','C104'),(2312,243,'Interaction Design',5,'2026-07-25 06:52:38.639','2026-07-25 07:52:38.639','C112'),(2313,243,'App Navigation',6,'2026-07-31 22:52:38.639','2026-08-01 01:52:38.639','C110'),(2314,243,'Media and Assets',7,'2026-08-02 22:52:38.639','2026-08-03 03:52:38.639','C113'),(2315,243,'Web service and API usage',8,'2026-08-07 21:52:38.639','2026-08-07 22:52:38.639','D113'),(2316,243,'Deployment',9,'2026-08-12 08:52:38.639','2026-08-12 12:52:38.639','C117'),(2317,243,'Publishing',10,'2026-08-17 15:52:38.639','2026-08-17 20:52:38.639','C108'),(2318,244,'Introduction to Refactoring & Bad Code Smell',1,'2026-06-29 03:41:17.262','2026-06-28 05:41:17.262','C116'),(2319,244,'The Bloaters',2,'2026-07-03 21:41:17.262','2026-07-04 02:41:17.262','D120'),(2320,244,'The OOP Abuser',3,'2026-07-09 08:41:17.262','2026-07-09 09:41:17.262','B102'),(2321,244,'The Change Preventer',4,'2026-07-14 05:41:17.262','2026-07-14 10:41:17.262','C118'),(2322,244,'The Dispensable',5,'2026-07-20 13:41:17.262','2026-07-20 16:41:17.262','B105'),(2323,244,'The Couplers',6,'2026-07-24 18:41:17.262','2026-07-24 19:41:17.262','C113'),(2324,244,'OOP Smell',7,'2026-07-28 11:41:17.262','2026-07-28 14:41:17.262','D115'),(2325,244,'Abstraction Smell',8,'2026-07-31 00:41:17.262','2026-07-31 02:41:17.262','C115'),(2326,244,'Encapsulation Smell',9,'2026-08-02 19:41:17.262','2026-08-03 00:41:17.262','D105'),(2327,244,'Modularization Smell',10,'2026-08-05 14:41:17.262','2026-08-05 17:41:17.262','B110'),(2328,244,'Hierarchy Smell',11,'2026-08-09 17:41:17.262','2026-08-08 20:41:17.262','B105'),(2329,246,'OOP & SOLID',1,'2026-07-25 11:25:48.086','2026-07-25 15:25:48.086','A104'),(2330,246,'Design Patterns',2,'2026-07-27 22:25:48.086','2026-07-28 03:25:48.086','A118'),(2331,246,'Creational Patterns',3,'2026-08-01 06:25:48.086','2026-08-01 11:25:48.086','A102'),(2332,246,'Structural Pattern',4,'2026-08-04 05:25:48.086','2026-08-04 08:25:48.086','C101'),(2333,246,'behavioral Pattern',5,'2026-08-07 04:25:48.086','2026-08-07 05:25:48.086','D114'),(2334,246,'Software Architecture',6,'2026-08-12 05:25:48.086','2026-08-12 06:25:48.086','C106'),(2335,246,'Layered & Monolithic Architecture',7,'2026-08-15 04:25:48.086','2026-08-15 06:25:48.086','B116'),(2336,246,'Microservices',8,'2026-08-18 19:25:48.086','2026-08-18 22:25:48.086','C111'),(2337,246,'Microkernel',9,'2026-08-25 17:25:48.086','2026-08-25 21:25:48.086','A119'),(2338,245,'Introduction to Software Engineering',1,'2026-07-11 02:19:32.366','2026-07-11 07:19:32.366','C108'),(2339,245,'AGILE',2,'2026-07-16 14:19:32.366','2026-07-16 17:19:32.366','B105'),(2340,245,'SCRUM',3,'2026-07-22 17:19:32.366','2026-07-22 18:19:32.366','A109'),(2341,245,'Requirement Engineering',4,'2026-07-28 09:19:32.366','2026-07-28 14:19:32.366','D113'),(2342,245,'Requirement Modeling and UML',5,'2026-08-03 05:19:32.366','2026-08-02 10:19:32.366','A109'),(2343,245,'Software Design Principles',6,'2026-08-07 15:19:32.366','2026-08-07 17:19:32.366','D119'),(2344,245,'Project Management',7,'2026-08-13 05:19:32.366','2026-08-13 06:19:32.366','D118'),(2345,245,'Project Scheduling',8,'2026-08-17 08:19:32.366','2026-08-16 10:19:32.366','B106'),(2346,245,'Risk Analysis',9,'2026-08-19 05:19:32.366','2026-08-19 10:19:32.366','B112'),(2347,245,'SCM',10,'2026-08-24 04:19:32.366','2026-08-23 06:19:32.366','D110'),(2348,245,'Version Control System',11,'2026-08-26 01:19:32.366','2026-08-26 06:19:32.366','D112'),(2349,245,'Reliability Engineering',12,'2026-08-30 18:19:32.366','2026-08-30 20:19:32.366','D113'),(2350,245,'Software Testing',13,'2026-09-05 01:19:32.366','2026-09-05 04:19:32.366','C107'),(2351,245,'Software Maintenance',14,'2026-09-11 18:19:32.366','2026-09-11 19:19:32.366','C107'),(2352,245,'DevOps',15,'2026-09-16 08:19:32.366','2026-09-16 13:19:32.366','D102');
/*!40000 ALTER TABLE `CourseSession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `File`
--

DROP TABLE IF EXISTS `File`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `File` (
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int NOT NULL,
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `gcCluster` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `File_userId_fkey` (`userId`),
  KEY `File_gcCluster_idx` (`gcCluster`),
  CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `File`
--

LOCK TABLES `File` WRITE;
/*!40000 ALTER TABLE `File` DISABLE KEYS */;
INSERT INTO `File` VALUES ('1byte.txt',1,'x1',8900,1),('1kb.txt',1024,'x2',8900,1),('1mb.txt',1048576,'x3',8900,1),('not_a_ppt.ppt',8,'x4',8900,1),('not_a_doc.doc',8,'x5',8900,1),('not_a_zip.zip',8,'x6',8900,1),('not_a_image.png',8,'x7',8900,1),('not_a_image.jpg',8,'x8',8900,1);
/*!40000 ALTER TABLE `File` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Forum`
--

DROP TABLE IF EXISTS `Forum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Forum` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `time` datetime(3) NOT NULL,
  `body` varchar(4000) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Forum_courseId_fkey` (`courseId`),
  KEY `Forum_userId_fkey` (`userId`),
  CONSTRAINT `Forum_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Forum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1448 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Forum`
--

LOCK TABLES `Forum` WRITE;
/*!40000 ALTER TABLE `Forum` DISABLE KEYS */;
INSERT INTO `Forum` VALUES (1365,'Exam Briefing',8901,238,'2026-07-04 00:21:18.727','A recap of today\'s session has been uploaded. It covers the points that were most commonly misunderstood.'),(1366,'Line Group',8900,238,'2026-07-10 03:48:28.461','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1367,'Announcement',8901,238,'2026-07-03 14:05:29.272','The exam will cover sessions 1 through 6. Please review your notes and the provided reading materials.'),(1368,'WA Group',9901,238,'2026-07-06 11:44:07.810','Quick question — are we allowed to use external libraries for the assignment or only the ones from class?'),(1369,'Question',9901,238,'2026-07-06 17:23:19.475','I don\'t understand the last part of the lecture. The explanation went a bit fast. Can someone help?'),(1370,'Exercise',8901,236,'2026-07-03 11:47:11.188','Reminder: attendance is mandatory for next week\'s session. Please inform me in advance if you cannot attend.'),(1371,'Announcement',8901,236,'2026-07-07 14:08:23.024','A correction to the formula discussed in today\'s session has been posted. Please update your notes.'),(1372,'Presentation',8901,236,'2026-07-06 08:42:24.593','Office hours this week will be moved to Thursday 2–4pm. Please plan accordingly.'),(1373,'Help',9907,236,'2026-06-27 18:46:20.418','Anyone else finding this topic particularly difficult? I\'ve read the slides three times and still lost.'),(1374,'WA Group',9906,236,'2026-07-07 05:09:31.457','Is the exam going to cover everything from the beginning of the semester or just the recent sessions?'),(1375,'Question',9906,236,'2026-07-07 23:50:55.586','Quick question — are we allowed to use external libraries for the assignment or only the ones from class?'),(1376,'Test',9909,236,'2026-07-08 16:36:51.173','Is office hours still happening this week or was it moved? I need to ask about my grade.'),(1377,'Task',8902,235,'2026-07-08 23:41:37.440','A recap of today\'s session has been uploaded. It covers the points that were most commonly misunderstood.'),(1378,'Exercise',8902,235,'2026-07-05 05:36:53.115','The group project rubric has been updated. Please re-read it carefully before your final submission.'),(1379,'Line Group',8902,235,'2026-07-03 03:37:21.475','Please ensure your submissions are in the correct format. Incorrectly formatted files will not be graded.'),(1380,'Assignment',8902,235,'2026-07-06 08:16:59.397','The assignment deadline has been extended by two days due to the public holiday. New deadline is Friday 11:59pm.'),(1381,'Help',9900,235,'2026-07-01 22:13:17.674','When is the deadline for the lab submission? I can\'t find it anywhere on the portal.'),(1382,'WA Group',9912,235,'2026-06-28 16:15:40.389','How many pages is the report supposed to be? The brief wasn\'t very clear on that.'),(1383,'Question',9913,235,'2026-07-04 00:00:49.028','I\'m having trouble with this week\'s assignment. Has anyone else run into the same issue?'),(1384,'Test',9900,235,'2026-07-05 18:00:06.995','How many pages is the report supposed to be? The brief wasn\'t very clear on that.'),(1385,'Presentation',8902,239,'2026-07-08 01:19:30.595','Next session will include a short quiz covering the last three topics. No calculators allowed.'),(1386,'Material',8902,239,'2026-06-30 14:26:31.089','Next session will include a short quiz covering the last three topics. No calculators allowed.'),(1387,'Assignment',8902,239,'2026-07-03 02:06:25.316','Reminder to complete the course evaluation form. Your feedback helps improve the course for future students.'),(1388,'Exam Briefing',8902,239,'2026-07-07 08:46:55.829','Please ensure your submissions are in the correct format. Incorrectly formatted files will not be graded.'),(1389,'WA Group',9905,239,'2026-07-08 05:50:10.725','Does anyone have notes from last session? I had to miss it due to a family matter.'),(1390,'Help',9900,239,'2026-06-27 18:18:17.299','How many pages is the report supposed to be? The brief wasn\'t very clear on that.'),(1391,'Attendance',9902,239,'2026-07-04 05:40:53.283','I\'m having trouble with this week\'s assignment. Has anyone else run into the same issue?'),(1392,'Material',8900,237,'2026-06-28 06:29:42.752','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1393,'Line Group',8900,237,'2026-06-30 05:06:06.017','Reminder to complete the course evaluation form. Your feedback helps improve the course for future students.'),(1394,'Exam Briefing',8901,237,'2026-07-06 17:10:25.567','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1395,'Question',9901,237,'2026-07-07 15:41:25.959','Just wanted to share a resource I found that explains this topic really well. Hope it helps everyone.'),(1396,'Test',9904,237,'2026-07-01 00:07:18.002','Anyone else finding this topic particularly difficult? I\'ve read the slides three times and still lost.'),(1397,'WA Group',9907,237,'2026-07-01 15:46:42.152','I don\'t understand the last part of the lecture. The explanation went a bit fast. Can someone help?'),(1398,'Help',9900,237,'2026-07-01 15:27:35.120','I\'m having trouble with this week\'s assignment. Has anyone else run into the same issue?'),(1399,'Presentation',8901,242,'2026-07-06 20:30:22.037','Reminder: attendance is mandatory for next week\'s session. Please inform me in advance if you cannot attend.'),(1400,'Exercise',8900,242,'2026-07-11 06:25:57.623','The lecture material for this week has been uploaded to the portal. Please review it before class.'),(1401,'Material',8901,242,'2026-07-09 03:13:33.909','Results for the midterm exam will be released by end of this week. Check the grades section.'),(1402,'Test',9912,242,'2026-07-09 18:34:50.150','Has anyone started on the group project yet? We should probably organize a meeting this week.'),(1403,'Help',9912,242,'2026-07-04 22:53:22.023','Just wanted to share a resource I found that explains this topic really well. Hope it helps everyone.'),(1404,'WA Group',9905,242,'2026-06-27 22:34:07.119','Is the exam going to cover everything from the beginning of the semester or just the recent sessions?'),(1405,'Line Group',8902,241,'2026-07-08 21:27:16.827','Results for the midterm exam will be released by end of this week. Check the grades section.'),(1406,'Assignment',8901,241,'2026-07-01 09:16:52.694','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1407,'Video Assignment',8901,241,'2026-07-07 15:16:40.848','Results for the midterm exam will be released by end of this week. Check the grades section.'),(1408,'Material',8902,241,'2026-07-04 14:49:19.907','A correction to the formula discussed in today\'s session has been posted. Please update your notes.'),(1409,'Exercise',8901,241,'2026-07-03 21:03:03.388','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1410,'WA Group',9906,241,'2026-07-09 14:53:07.529','Has anyone started on the group project yet? We should probably organize a meeting this week.'),(1411,'Attendance',9913,241,'2026-07-06 13:25:56.321','Gentle reminder that our group presentation is next week — let\'s finalize the slides by Thursday.'),(1412,'Help',9913,241,'2026-07-10 03:58:00.467','Anyone else finding this topic particularly difficult? I\'ve read the slides three times and still lost.'),(1413,'Question',9907,241,'2026-07-02 01:40:00.367','I\'m having trouble with this week\'s assignment. Has anyone else run into the same issue?'),(1414,'Line Group',8901,240,'2026-07-05 20:24:03.331','The lecture material for this week has been uploaded to the portal. Please review it before class.'),(1415,'Material',8902,240,'2026-07-07 16:51:42.073','A recap of today\'s session has been uploaded. It covers the points that were most commonly misunderstood.'),(1416,'Exercise',8902,240,'2026-06-28 15:36:40.892','The exam will cover sessions 1 through 6. Please review your notes and the provided reading materials.'),(1417,'Announcement',8901,240,'2026-07-05 07:35:26.901','There will be a guest lecture next week. Attendance will be recorded and counts toward participation.'),(1418,'Assignment',8902,240,'2026-06-30 04:35:26.858','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1419,'Help',9907,240,'2026-07-01 22:20:47.585','Just wanted to share a resource I found that explains this topic really well. Hope it helps everyone.'),(1420,'WA Group',9905,240,'2026-07-09 23:13:04.627','Has anyone started on the group project yet? We should probably organize a meeting this week.'),(1421,'Attendance',9911,240,'2026-07-09 16:35:02.957','When is the deadline for the lab submission? I can\'t find it anywhere on the portal.'),(1422,'Line Group',8901,243,'2026-06-28 00:10:14.056','The exam will cover sessions 1 through 6. Please review your notes and the provided reading materials.'),(1423,'Task',8901,243,'2026-06-28 21:20:54.684','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1424,'Exercise',8901,243,'2026-07-08 21:04:16.885','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1425,'Video Assignment',8901,243,'2026-07-05 16:32:09.728','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1426,'Material',8901,243,'2026-07-08 01:13:56.864','Reminder: attendance is mandatory for next week\'s session. Please inform me in advance if you cannot attend.'),(1427,'Attendance',9900,243,'2026-07-06 22:43:53.208','Does anyone have notes from last session? I had to miss it due to a family matter.'),(1428,'WA Group',9900,243,'2026-06-29 21:31:32.698','I don\'t understand the last part of the lecture. The explanation went a bit fast. Can someone help?'),(1429,'Material',8900,244,'2026-07-03 10:38:51.879','Next session will include a short quiz covering the last three topics. No calculators allowed.'),(1430,'Task',8900,244,'2026-07-01 17:24:46.564','Office hours this week will be moved to Thursday 2–4pm. Please plan accordingly.'),(1431,'Announcement',8900,244,'2026-07-05 04:43:22.301','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1432,'WA Group',9900,244,'2026-07-08 15:59:07.150','Is office hours still happening this week or was it moved? I need to ask about my grade.'),(1433,'Test',9912,244,'2026-07-01 10:36:57.305','Can someone explain the difference between the two approaches discussed in class? I keep getting confused.'),(1434,'Material',8901,246,'2026-07-06 15:45:23.424','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1435,'Exercise',8901,246,'2026-07-10 16:43:44.810','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1436,'Exam Briefing',8901,246,'2026-06-29 06:26:31.186','Please form your groups for the final project by Friday and submit the group member list via this forum.'),(1437,'Attendance',9905,246,'2026-07-01 09:32:09.658','Has anyone started on the group project yet? We should probably organize a meeting this week.'),(1438,'Help',9905,246,'2026-07-04 11:36:14.914','Has anyone started on the group project yet? We should probably organize a meeting this week.'),(1439,'WA Group',9999,246,'2026-07-10 05:49:03.480','Just wanted to share a resource I found that explains this topic really well. Hope it helps everyone.'),(1440,'Exam Briefing',8900,245,'2026-07-10 10:01:39.686','Please submit your assignments before the deadline. Late submissions will not be accepted without prior notice.'),(1441,'Exercise',8900,245,'2026-07-01 08:56:38.668','There will be a guest lecture next week. Attendance will be recorded and counts toward participation.'),(1442,'Presentation',8900,245,'2026-07-01 11:36:50.185','Please ensure your submissions are in the correct format. Incorrectly formatted files will not be graded.'),(1443,'Material',8900,245,'2026-06-28 14:14:53.515','The lecture material for this week has been uploaded to the portal. Please review it before class.'),(1444,'Video Assignment',8900,245,'2026-07-11 06:31:08.434','Office hours this week will be moved to Thursday 2–4pm. Please plan accordingly.'),(1445,'Attendance',9913,245,'2026-07-08 03:15:26.942','How many pages is the report supposed to be? The brief wasn\'t very clear on that.'),(1446,'Test',9908,245,'2026-07-01 18:48:50.083','Is the exam going to cover everything from the beginning of the semester or just the recent sessions?'),(1447,'Help',9910,245,'2026-07-05 06:43:51.664','Has anyone started on the group project yet? We should probably organize a meeting this week.');
/*!40000 ALTER TABLE `Forum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ForumComment`
--

DROP TABLE IF EXISTS `ForumComment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ForumComment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `forumId` int NOT NULL,
  `parentId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `time` datetime(3) NOT NULL,
  `body` varchar(4000) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ForumComment_parentId_fkey` (`parentId`),
  KEY `ForumComment_forumId_fkey` (`forumId`),
  KEY `ForumComment_userId_fkey` (`userId`),
  CONSTRAINT `ForumComment_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ForumComment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ForumComment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ForumComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7422 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ForumComment`
--

LOCK TABLES `ForumComment` WRITE;
/*!40000 ALTER TABLE `ForumComment` DISABLE KEYS */;
INSERT INTO `ForumComment` VALUES (7193,1368,NULL,9902,'2026-07-11 13:50:26.811','We should make a group chat for this. Anyone have everyone\'s contact?'),(7194,1368,NULL,9907,'2026-06-29 04:15:50.785','This is really helpful, bookmarking this.'),(7195,1368,NULL,9910,'2026-07-03 18:40:55.320','I had the same question, glad someone asked.'),(7196,1366,NULL,9903,'2026-07-07 17:47:11.225','I had the same question, glad someone asked.'),(7197,1366,NULL,9907,'2026-06-29 13:57:07.235','Thanks for the reminder! I almost forgot about the presentation.'),(7198,1366,NULL,9910,'2026-07-03 17:45:00.170','Pretty sure it covers everything. Better safe than sorry.'),(7199,1366,NULL,9913,'2026-07-07 20:16:11.731','I can share my notes, give me a moment to upload them.'),(7200,1367,NULL,9902,'2026-07-07 13:38:08.112','I had the same question, glad someone asked.'),(7201,1367,NULL,9907,'2026-07-07 21:01:01.532','This is really helpful, bookmarking this.'),(7202,1367,NULL,9910,'2026-07-05 02:13:13.071','I can share my notes, give me a moment to upload them.'),(7203,1377,NULL,9913,'2026-07-01 11:34:55.875','This is really helpful, bookmarking this.'),(7204,1378,NULL,9913,'2026-07-10 03:43:04.766','This is really helpful, bookmarking this.'),(7205,1380,NULL,9901,'2026-07-06 03:27:11.775','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7206,1379,NULL,9912,'2026-07-07 05:08:07.863','I found a YouTube video that explains this really well, let me find the link.'),(7207,1383,NULL,9900,'2026-07-09 12:52:37.408','I failed to understand that part too. Going to office hours tomorrow.'),(7208,1370,NULL,9907,'2026-07-11 00:13:22.038','We should make a group chat for this. Anyone have everyone\'s contact?'),(7209,1371,NULL,9905,'2026-06-30 05:06:45.672','We should make a group chat for this. Anyone have everyone\'s contact?'),(7210,1372,NULL,9909,'2026-07-04 04:17:57.629','I can share my notes, give me a moment to upload them.'),(7211,1373,NULL,9909,'2026-06-27 17:14:55.704','I think the deadline is on the course schedule page.'),(7212,1374,NULL,9905,'2026-07-04 22:52:28.807','Thanks, this really helped!'),(7213,1375,NULL,9905,'2026-06-28 23:15:30.448','The slides are actually on the portal under session materials.'),(7214,1376,NULL,9905,'2026-07-01 13:21:08.724','The slides are actually on the portal under session materials.'),(7215,1385,NULL,9900,'2026-07-01 00:03:49.493','Pretty sure it covers everything. Better safe than sorry.'),(7216,1385,NULL,9902,'2026-07-02 02:08:36.212','I had the same question, glad someone asked.'),(7217,1385,NULL,9905,'2026-07-04 12:33:27.391','Same issue here. I ended up just emailing the lecturer.'),(7218,1386,NULL,9900,'2026-06-28 03:15:33.182','Pretty sure it covers everything. Better safe than sorry.'),(7219,1386,NULL,9902,'2026-07-03 11:04:41.844','I can share my notes, give me a moment to upload them.'),(7220,1386,NULL,9905,'2026-07-11 14:15:23.685','This is really helpful, bookmarking this.'),(7221,1387,NULL,9902,'2026-06-30 06:22:42.952','Same issue here. I ended up just emailing the lecturer.'),(7222,1389,NULL,9900,'2026-07-02 03:52:56.754','I can share my notes, give me a moment to upload them.'),(7223,1389,NULL,9905,'2026-07-03 06:35:36.618','Same issue here. I ended up just emailing the lecturer.'),(7224,1392,NULL,9904,'2026-07-07 11:46:20.569','Same issue here. I ended up just emailing the lecturer.'),(7225,1392,NULL,9901,'2026-06-29 14:52:08.294','This is really helpful, bookmarking this.'),(7226,1392,NULL,9908,'2026-06-28 18:32:50.549','I asked during office hours and the answer is yes, individual submission.'),(7227,1393,NULL,9910,'2026-07-11 14:06:43.914','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7228,1394,NULL,9900,'2026-07-01 04:22:57.234','I can share my notes, give me a moment to upload them.'),(7229,1394,NULL,9907,'2026-07-04 04:37:39.099','Same issue here. I ended up just emailing the lecturer.'),(7230,1394,NULL,9908,'2026-07-10 13:10:39.210','I had the same question, glad someone asked.'),(7231,1395,NULL,9904,'2026-07-05 07:00:12.178','I can share my notes, give me a moment to upload them.'),(7232,1396,NULL,9900,'2026-06-30 08:32:04.112','Thanks for the reminder! I almost forgot about the presentation.'),(7233,1396,NULL,9909,'2026-06-30 12:15:23.941','I think the deadline is on the course schedule page.'),(7234,1396,NULL,9901,'2026-06-28 15:46:20.203','The slides are actually on the portal under session materials.'),(7235,1396,NULL,9910,'2026-07-09 17:26:41.805','I had the same question, glad someone asked.'),(7236,1398,NULL,9904,'2026-07-05 22:39:27.161','I think external libraries are fine as long as you cite them.'),(7237,1397,NULL,9900,'2026-06-28 17:31:45.740','We should make a group chat for this. Anyone have everyone\'s contact?'),(7238,1397,NULL,9908,'2026-07-05 14:15:22.260','Thanks for the reminder! I almost forgot about the presentation.'),(7239,1399,NULL,9902,'2026-07-07 06:53:40.779','I failed to understand that part too. Going to office hours tomorrow.'),(7240,1399,NULL,9912,'2026-07-10 13:43:19.329','I can share my notes, give me a moment to upload them.'),(7241,1400,NULL,9905,'2026-06-29 21:38:02.021','Pretty sure it covers everything. Better safe than sorry.'),(7242,1401,NULL,9902,'2026-06-29 21:46:20.301','Same issue here. I ended up just emailing the lecturer.'),(7243,1402,NULL,9902,'2026-07-10 08:37:33.995','The slides are actually on the portal under session materials.'),(7244,1402,NULL,9909,'2026-07-05 00:08:27.002','I had the same question, glad someone asked.'),(7245,1403,NULL,9907,'2026-07-01 08:35:47.062','I failed to understand that part too. Going to office hours tomorrow.'),(7246,1403,NULL,9909,'2026-06-30 02:43:49.660','Thanks, this really helped!'),(7247,1403,NULL,9905,'2026-06-30 03:05:09.156','I failed to understand that part too. Going to office hours tomorrow.'),(7248,1404,NULL,9902,'2026-06-29 16:27:54.483','Thanks for the reminder! I almost forgot about the presentation.'),(7249,1404,NULL,9909,'2026-07-08 04:11:09.063','Thanks for the reminder! I almost forgot about the presentation.'),(7250,1404,NULL,9905,'2026-07-08 05:51:25.227','I can share my notes, give me a moment to upload them.'),(7251,1405,NULL,9902,'2026-07-07 12:05:51.821','I found a YouTube video that explains this really well, let me find the link.'),(7252,1407,NULL,9913,'2026-07-02 15:37:45.131','Same issue here. I ended up just emailing the lecturer.'),(7253,1408,NULL,9913,'2026-06-29 10:20:02.668','I had the same question, glad someone asked.'),(7254,1408,NULL,9909,'2026-07-07 08:45:06.930','I think external libraries are fine as long as you cite them.'),(7255,1408,NULL,9908,'2026-07-06 00:48:29.817','Same issue here. I ended up just emailing the lecturer.'),(7256,1409,NULL,9902,'2026-06-28 20:57:12.081','I failed to understand that part too. Going to office hours tomorrow.'),(7257,1409,NULL,9909,'2026-07-01 11:54:05.107','I can share my notes, give me a moment to upload them.'),(7258,1409,NULL,9908,'2026-07-11 05:12:23.545','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7259,1410,NULL,9908,'2026-06-29 20:06:52.826','Same issue here. I ended up just emailing the lecturer.'),(7260,1411,NULL,9907,'2026-07-07 11:42:20.769','We should make a group chat for this. Anyone have everyone\'s contact?'),(7261,1411,NULL,9909,'2026-07-10 22:26:13.198','Thanks for the reminder! I almost forgot about the presentation.'),(7262,1412,NULL,9906,'2026-07-07 16:00:12.022','Pretty sure it covers everything. Better safe than sorry.'),(7263,1412,NULL,9902,'2026-07-05 17:38:42.747','I failed to understand that part too. Going to office hours tomorrow.'),(7264,1412,NULL,9913,'2026-07-01 07:40:25.808','Same issue here. I ended up just emailing the lecturer.'),(7265,1412,NULL,9909,'2026-06-27 17:45:06.602','I asked during office hours and the answer is yes, individual submission.'),(7266,1413,NULL,9906,'2026-06-29 15:38:33.229','I can share my notes, give me a moment to upload them.'),(7267,1413,NULL,9907,'2026-07-07 17:21:15.889','I failed to understand that part too. Going to office hours tomorrow.'),(7268,1413,NULL,9902,'2026-07-03 01:29:30.755','I asked during office hours and the answer is yes, individual submission.'),(7269,1413,NULL,9913,'2026-07-08 16:25:17.111','The slides are actually on the portal under session materials.'),(7270,1414,NULL,9900,'2026-07-04 00:47:16.077','The slides are actually on the portal under session materials.'),(7271,1414,NULL,9907,'2026-07-04 14:55:56.449','I think the deadline is on the course schedule page.'),(7272,1415,NULL,9909,'2026-06-28 07:24:46.965','Thanks for the reminder! I almost forgot about the presentation.'),(7273,1415,NULL,9900,'2026-07-11 05:26:36.060','I can share my notes, give me a moment to upload them.'),(7274,1415,NULL,9905,'2026-06-29 02:58:21.139','Same issue here. I ended up just emailing the lecturer.'),(7275,1416,NULL,9900,'2026-07-09 12:28:07.765','Pretty sure it covers everything. Better safe than sorry.'),(7276,1416,NULL,9903,'2026-07-01 22:35:07.818','I had the same question, glad someone asked.'),(7277,1417,NULL,9909,'2026-07-05 10:23:17.211','Thanks, this really helped!'),(7278,1417,NULL,9905,'2026-07-07 15:16:42.689','I had the same question, glad someone asked.'),(7279,1417,NULL,9907,'2026-07-10 22:39:52.149','I failed to understand that part too. Going to office hours tomorrow.'),(7280,1417,NULL,9903,'2026-07-05 17:38:37.221','I found a YouTube video that explains this really well, let me find the link.'),(7281,1418,NULL,9905,'2026-07-02 19:24:19.792','I found a YouTube video that explains this really well, let me find the link.'),(7282,1418,NULL,9907,'2026-07-01 07:24:58.118','Thanks for the reminder! I almost forgot about the presentation.'),(7283,1419,NULL,9905,'2026-06-27 19:35:30.520','I had the same question, glad someone asked.'),(7284,1419,NULL,9910,'2026-06-30 01:02:14.893','I failed to understand that part too. Going to office hours tomorrow.'),(7285,1420,NULL,9910,'2026-07-04 19:05:23.481','I found a YouTube video that explains this really well, let me find the link.'),(7286,1421,NULL,9911,'2026-06-30 02:49:11.888','This is really helpful, bookmarking this.'),(7287,1421,NULL,9900,'2026-07-05 23:19:14.075','This is really helpful, bookmarking this.'),(7288,1421,NULL,9907,'2026-07-10 02:15:20.643','I think the deadline is on the course schedule page.'),(7289,1421,NULL,9910,'2026-07-10 17:47:29.134','Thanks, this really helped!'),(7290,1422,NULL,9911,'2026-07-05 03:34:52.238','Same issue here. I ended up just emailing the lecturer.'),(7291,1422,NULL,9909,'2026-07-10 21:50:39.675','This is really helpful, bookmarking this.'),(7292,1422,NULL,9913,'2026-07-06 14:43:44.095','I asked during office hours and the answer is yes, individual submission.'),(7293,1422,NULL,9905,'2026-07-05 22:01:59.119','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7294,1423,NULL,9905,'2026-07-08 19:11:42.162','I asked during office hours and the answer is yes, individual submission.'),(7295,1425,NULL,9911,'2026-07-04 06:55:31.430','I think the deadline is on the course schedule page.'),(7296,1425,NULL,9904,'2026-06-29 06:19:15.947','The slides are actually on the portal under session materials.'),(7297,1425,NULL,9913,'2026-06-29 16:46:24.513','We should make a group chat for this. Anyone have everyone\'s contact?'),(7298,1425,NULL,9905,'2026-06-29 10:02:38.602','The slides are actually on the portal under session materials.'),(7299,1426,NULL,9913,'2026-07-10 17:42:13.279','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7300,1427,NULL,9909,'2026-06-27 23:24:48.771','I failed to understand that part too. Going to office hours tomorrow.'),(7301,1427,NULL,9900,'2026-07-01 05:17:12.447','I failed to understand that part too. Going to office hours tomorrow.'),(7302,1427,NULL,9905,'2026-07-04 00:29:23.036','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7303,1428,NULL,9904,'2026-06-28 23:29:35.498','Thanks, this really helped!'),(7304,1429,NULL,9912,'2026-06-28 15:59:37.057','I think the deadline is on the course schedule page.'),(7305,1429,NULL,9900,'2026-06-28 20:26:54.234','Pretty sure it covers everything. Better safe than sorry.'),(7306,1430,NULL,9902,'2026-07-01 03:51:43.475','Same issue here. I ended up just emailing the lecturer.'),(7307,1431,NULL,9900,'2026-06-28 12:05:01.184','I can share my notes, give me a moment to upload them.'),(7308,1431,NULL,9999,'2026-07-03 00:21:55.592','Pretty sure it covers everything. Better safe than sorry.'),(7309,1433,NULL,9912,'2026-07-03 08:16:26.719','The slides are actually on the portal under session materials.'),(7310,1433,NULL,9999,'2026-07-09 22:41:46.564','I can share my notes, give me a moment to upload them.'),(7311,1432,NULL,9912,'2026-07-08 09:29:06.746','I think the deadline is on the course schedule page.'),(7312,1432,NULL,9900,'2026-07-01 17:08:00.809','I found a YouTube video that explains this really well, let me find the link.'),(7313,1434,NULL,9912,'2026-06-28 08:52:58.593','Thanks for the reminder! I almost forgot about the presentation.'),(7314,1434,NULL,9908,'2026-07-07 22:16:54.692','This is really helpful, bookmarking this.'),(7315,1437,NULL,9912,'2026-07-03 16:33:32.583','I think the deadline is on the course schedule page.'),(7316,1437,NULL,9902,'2026-07-10 07:29:34.825','I had the same question, glad someone asked.'),(7317,1437,NULL,9905,'2026-07-05 13:55:01.337','Same issue here. I ended up just emailing the lecturer.'),(7318,1437,NULL,9908,'2026-06-27 18:41:41.425','I found a YouTube video that explains this really well, let me find the link.'),(7319,1435,NULL,9999,'2026-07-10 05:05:09.656','I failed to understand that part too. Going to office hours tomorrow.'),(7320,1438,NULL,9908,'2026-07-08 11:04:27.102','Same issue here. I ended up just emailing the lecturer.'),(7321,1439,NULL,9904,'2026-07-03 10:41:31.572','I asked during office hours and the answer is yes, individual submission.'),(7322,1440,NULL,9906,'2026-07-07 16:30:34.839','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7323,1440,NULL,9901,'2026-06-30 01:17:12.139','Pretty sure it covers everything. Better safe than sorry.'),(7324,1442,NULL,9908,'2026-07-09 20:20:04.867','Same issue here. I ended up just emailing the lecturer.'),(7325,1442,NULL,9901,'2026-07-01 11:23:51.199','Same issue here. I ended up just emailing the lecturer.'),(7326,1443,NULL,9908,'2026-07-08 23:02:14.253','We should make a group chat for this. Anyone have everyone\'s contact?'),(7327,1443,NULL,9913,'2026-07-04 19:32:41.059','Same issue here. I ended up just emailing the lecturer.'),(7328,1444,NULL,9906,'2026-07-09 16:35:43.425','I had the same question, glad someone asked.'),(7329,1444,NULL,9910,'2026-07-02 16:40:36.567','I had the same question, glad someone asked.'),(7330,1445,NULL,9913,'2026-07-04 14:45:45.456','The slides are actually on the portal under session materials.'),(7331,1446,NULL,9911,'2026-07-10 13:29:30.792','I think external libraries are fine as long as you cite them.'),(7332,1447,NULL,9908,'2026-07-02 01:22:43.627','I can share my notes, give me a moment to upload them.'),(7333,1447,NULL,9901,'2026-07-01 03:26:02.503','Thanks for the reminder! I almost forgot about the presentation.'),(7334,1447,NULL,9913,'2026-06-28 16:07:02.382','Same issue here. I ended up just emailing the lecturer.'),(7335,1368,7195,9910,'2026-07-02 18:52:07.552','Pretty sure it covers everything. Better safe than sorry.'),(7336,1366,7197,9913,'2026-07-02 18:06:06.886','This is really helpful, bookmarking this.'),(7337,1366,7198,9902,'2026-07-02 16:40:35.083','I had the same question, glad someone asked.'),(7338,1366,7199,9907,'2026-07-01 03:10:30.055','We should make a group chat for this. Anyone have everyone\'s contact?'),(7339,1366,7199,9910,'2026-07-11 11:28:49.267','I found a YouTube video that explains this really well, let me find the link.'),(7340,1378,7204,9900,'2026-06-27 23:10:18.842','I had the same question, glad someone asked.'),(7341,1380,7205,9901,'2026-07-05 09:40:41.058','I think external libraries are fine as long as you cite them.'),(7342,1380,7205,9913,'2026-06-27 18:57:31.809','I think the deadline is on the course schedule page.'),(7343,1371,7209,9905,'2026-07-08 21:41:42.949','Pretty sure it covers everything. Better safe than sorry.'),(7344,1373,7211,9903,'2026-07-08 04:54:39.354','Pretty sure it covers everything. Better safe than sorry.'),(7345,1386,7218,9902,'2026-06-30 09:39:09.922','Pretty sure it covers everything. Better safe than sorry.'),(7346,1386,7219,9903,'2026-07-04 08:58:37.270','I found a YouTube video that explains this really well, let me find the link.'),(7347,1393,7227,9910,'2026-06-28 00:48:11.623','The slides are actually on the portal under session materials.'),(7348,1395,7231,9907,'2026-07-05 22:22:14.564','Thanks for the reminder! I almost forgot about the presentation.'),(7349,1394,7228,9908,'2026-07-02 07:08:26.313','I asked during office hours and the answer is yes, individual submission.'),(7350,1392,7226,9900,'2026-06-27 16:03:00.211','Pretty sure it covers everything. Better safe than sorry.'),(7351,1392,7226,9909,'2026-07-06 01:58:33.755','Thanks, this really helped!'),(7352,1396,7232,9907,'2026-06-28 05:07:54.544','Thanks, this really helped!'),(7353,1396,7235,9908,'2026-06-30 18:41:45.737','Pretty sure it covers everything. Better safe than sorry.'),(7354,1397,7237,9900,'2026-07-09 04:48:45.367','I can share my notes, give me a moment to upload them.'),(7355,1397,7237,9907,'2026-06-28 05:51:58.302','I had the same question, glad someone asked.'),(7356,1397,7237,9910,'2026-07-07 22:06:59.202','Same issue here. I ended up just emailing the lecturer.'),(7357,1397,7238,9910,'2026-07-10 19:27:42.488','I failed to understand that part too. Going to office hours tomorrow.'),(7358,1401,7242,9912,'2026-07-09 18:21:54.192','I can share my notes, give me a moment to upload them.'),(7359,1399,7240,9907,'2026-07-09 13:12:11.214','Same issue here. I ended up just emailing the lecturer.'),(7360,1399,7240,9912,'2026-07-07 03:29:49.243','The slides are actually on the portal under session materials.'),(7361,1402,7243,9903,'2026-07-09 20:02:27.389','I asked during office hours and the answer is yes, individual submission.'),(7362,1404,7249,9902,'2026-07-07 07:40:09.167','I found a YouTube video that explains this really well, let me find the link.'),(7363,1404,7249,9903,'2026-07-03 17:36:45.171','Same issue here. I ended up just emailing the lecturer.'),(7364,1404,7250,9909,'2026-07-03 02:10:37.135','Same issue here. I ended up just emailing the lecturer.'),(7365,1403,7245,9903,'2026-07-02 15:06:30.801','Pretty sure it covers everything. Better safe than sorry.'),(7366,1408,7254,9909,'2026-07-02 12:20:27.561','I think external libraries are fine as long as you cite them.'),(7367,1409,7258,9913,'2026-07-10 12:39:46.507','Pretty sure it covers everything. Better safe than sorry.'),(7368,1413,7267,9913,'2026-07-03 03:26:02.300','I found a YouTube video that explains this really well, let me find the link.'),(7369,1414,7271,9910,'2026-07-10 12:04:04.544','Thanks for the reminder! I almost forgot about the presentation.'),(7370,1415,7272,9909,'2026-07-05 09:41:17.360','Pretty sure it covers everything. Better safe than sorry.'),(7371,1415,7273,9911,'2026-07-08 07:12:07.980','We should make a group chat for this. Anyone have everyone\'s contact?'),(7372,1415,7274,9904,'2026-06-30 00:25:12.161','Thanks, this really helped!'),(7373,1416,7276,9900,'2026-07-10 10:52:00.799','The slides are actually on the portal under session materials.'),(7374,1417,7278,9904,'2026-06-28 23:13:38.048','Thanks for the reminder! I almost forgot about the presentation.'),(7375,1417,7280,9909,'2026-07-10 10:33:29.685','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7376,1417,7280,9905,'2026-07-05 07:24:13.312','Thanks for the reminder! I almost forgot about the presentation.'),(7377,1417,7280,9907,'2026-07-07 12:11:17.416','Thanks for the reminder! I almost forgot about the presentation.'),(7378,1417,7280,9903,'2026-06-30 06:39:31.030','I had the same question, glad someone asked.'),(7379,1418,7281,9905,'2026-06-27 23:34:21.056','I think the deadline is on the course schedule page.'),(7380,1418,7282,9905,'2026-06-28 11:55:49.147','I failed to understand that part too. Going to office hours tomorrow.'),(7381,1420,7285,9909,'2026-07-05 08:32:02.356','This is really helpful, bookmarking this.'),(7382,1420,7285,9903,'2026-07-10 01:39:51.844','The slides are actually on the portal under session materials.'),(7383,1419,7283,9904,'2026-07-11 14:01:21.387','Pretty sure it covers everything. Better safe than sorry.'),(7384,1421,7288,9905,'2026-07-11 00:47:25.937','I had the same question, glad someone asked.'),(7385,1422,7291,9913,'2026-07-03 07:55:28.504','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7386,1422,7290,9913,'2026-07-11 07:13:07.303','This is really helpful, bookmarking this.'),(7387,1422,7292,9900,'2026-07-01 10:33:11.200','I think the deadline is on the course schedule page.'),(7388,1425,7297,9909,'2026-07-01 19:01:52.853','I failed to understand that part too. Going to office hours tomorrow.'),(7389,1425,7298,9904,'2026-07-04 23:42:20.359','I can share my notes, give me a moment to upload them.'),(7390,1427,7300,9905,'2026-07-10 09:39:27.072','Same issue here. I ended up just emailing the lecturer.'),(7391,1427,7301,9913,'2026-07-09 06:20:03.729','I can share my notes, give me a moment to upload them.'),(7392,1429,7304,9909,'2026-07-05 09:08:11.957','Thanks, this really helped!'),(7393,1431,7307,9900,'2026-07-06 16:07:28.144','I asked during office hours and the answer is yes, individual submission.'),(7394,1431,7308,9902,'2026-07-02 23:17:52.808','I failed to understand that part too. Going to office hours tomorrow.'),(7395,1433,7310,9902,'2026-07-07 14:21:14.755','Same issue here. I ended up just emailing the lecturer.'),(7396,1433,7310,9900,'2026-06-30 20:21:39.387','This is really helpful, bookmarking this.'),(7397,1437,7315,9912,'2026-07-08 19:04:15.081','The slides are actually on the portal under session materials.'),(7398,1437,7316,9908,'2026-07-11 02:24:38.169','Thanks for the reminder! I almost forgot about the presentation.'),(7399,1435,7319,9999,'2026-06-30 14:40:20.034','I had the same question, glad someone asked.'),(7400,1440,7322,9908,'2026-06-30 20:19:18.198','I can share my notes, give me a moment to upload them.'),(7401,1438,7320,9999,'2026-07-03 11:32:46.483','I asked during office hours and the answer is yes, individual submission.'),(7402,1443,7327,9906,'2026-06-29 19:02:23.348','This is really helpful, bookmarking this.'),(7403,1443,7327,9910,'2026-07-08 22:14:45.331','Can confirm, the formula correction is important. I got the wrong answer without it.'),(7404,1445,7330,9906,'2026-06-28 08:35:30.845','Same issue here. I ended up just emailing the lecturer.'),(7405,1445,7330,9910,'2026-06-28 09:27:02.204','Thanks, this really helped!'),(7406,1446,7331,9908,'2026-07-07 15:15:19.378','Thanks, this really helped!'),(7407,1446,7331,9901,'2026-07-08 12:42:27.000','Thanks for the reminder! I almost forgot about the presentation.'),(7408,1366,7338,9903,'2026-06-28 05:25:02.935','I asked during office hours and the answer is yes, individual submission.'),(7409,1397,7356,9904,'2026-07-08 07:37:08.530','I think external libraries are fine as long as you cite them.'),(7410,1399,7359,9903,'2026-07-03 03:42:14.969','Same issue here. I ended up just emailing the lecturer.'),(7411,1399,7360,9903,'2026-07-04 11:45:16.034','I asked during office hours and the answer is yes, individual submission.'),(7412,1404,7362,9912,'2026-07-08 21:14:12.503','Thanks for the reminder! I almost forgot about the presentation.'),(7413,1415,7370,9904,'2026-07-10 13:23:24.721','I can share my notes, give me a moment to upload them.'),(7414,1417,7376,9903,'2026-07-11 04:15:38.219','I asked during office hours and the answer is yes, individual submission.'),(7415,1417,7377,9905,'2026-06-29 16:33:42.776','I think the deadline is on the course schedule page.'),(7416,1417,7378,9905,'2026-07-03 11:33:07.440','I asked during office hours and the answer is yes, individual submission.'),(7417,1422,7386,9909,'2026-07-04 08:21:35.892','Same issue here. I ended up just emailing the lecturer.'),(7418,1425,7389,9909,'2026-07-02 05:05:10.549','I had the same question, glad someone asked.'),(7419,1437,7398,9905,'2026-07-01 22:51:39.076','I failed to understand that part too. Going to office hours tomorrow.'),(7420,1438,7401,9905,'2026-07-07 14:20:59.132','I failed to understand that part too. Going to office hours tomorrow.'),(7421,1399,7411,9909,'2026-06-30 03:12:03.373','I failed to understand that part too. Going to office hours tomorrow.');
/*!40000 ALTER TABLE `ForumComment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwhash` binary(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (8900,'John','john@example.com','Teacher',0x7A787A770C3A9363FA8DDCAD0A6D5336E5087232CE8845C3D53441ECB70B2E2A),(8901,'Charles','charles@example.com','Teacher',0x21DFC0F2FE7EB3E9A112F1DC7E28F05EA30365F5404ADB17C6BEA361892CC0AA),(8902,'Matthew W','matthew.w@example.com','Teacher',0x87D26BB1A86A100275C3428330B8AC4E04D204F537BDFE2D2300715F405396D0),(9900,'Andrew P','andrew.p@example.com','Student',0xA7D5DE42006C47A16AE34DB433A646FE68ABB529F2B92AF5FA86CEAB8DBC280D),(9901,'Evan K','evan.k@example.com','Student',0xAFE79896833875DA1AC5379A0B42B6FE0BA8859029651E53ED57CEEE41E81D65),(9902,'Tommy','tommy@example.com','Student',0xDD10A607F3919CF41A3E04FE6350E7A9C0E5848D393B36F671E9D8CD8A10DD70),(9903,'Calvin Chan','calvin.chan@example.com','Student',0x560F0359734C078FDBCC1037ED78DA7A57B8BBEC360D76F4200AFB2869436CE7),(9904,'Alex G','alex.g@example.com','Student',0x592C25F45C9FFE32F18CC6823B5FDB6E709279E2225B7EC40122BF2AAAF10457),(9905,'Thomas','thomas@example.com','Student',0x02618838C6F70AA733D3B8B3CDAD22EE040AA4B6296B3BACE0F490CE650AE7C7),(9906,'Kenneth','kenneth@example.com','Student',0xA48132DDD3709FA43F653B28BC72C5EBFA4FCBB18C0872BC3046EF9D6D433D5C),(9907,'Abel','abel@example.com','Student',0xB81D8D29595401E17B8D4DE9CC294A4E9273FB37CA4D5C9A2189A913032CF645),(9908,'Jonathan E','jonathan.e@example.com','Student',0x2E7B51578D311EFEB675E5DBAD54242787E8BABE953C4389D0D25B80BC873CE4),(9909,'Charlie R','charlie.r@example.com','Student',0x8154FE9BF35F8CB26A31EE6A5AA824C018C5195D7DDA675FC44E5A952B67881C),(9910,'Joe P','joe.p@example.com','Student',0x009FAABB76768EA5BCAD2F43FF95E4E4B0A7DDAD535CB053F1E0403ED54CAF43),(9911,'Henry L','henry.l@example.com','Student',0x1B3CACA0F5ECF1DF163D4845D8BD211AF8AFA4254BBED68EB746B607377D785F),(9912,'Jimmy C','jimmy.c@example.com','Student',0x2C657BBFB43DB07A54F56F3D1BF23989F6A6DD008A3FF094102FD809F9B1E4B8),(9913,'foo','foo@example.com','Student',0xA9DA397B528E2EBB1D3881AC4966924F8A617636CCD26951EE68FE343A2B49B6),(9999,'system','system@example.com','Student',0x035BFDB2901E01333E5DA51F09103EE2584671E0229CBDCF9D347FA695613C50);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_CourseSessionToFile`
--

DROP TABLE IF EXISTS `_CourseSessionToFile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_CourseSessionToFile` (
  `A` int NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_CourseSessionToFile_AB_unique` (`A`,`B`),
  KEY `_CourseSessionToFile_B_index` (`B`),
  CONSTRAINT `_CourseSessionToFile_A_fkey` FOREIGN KEY (`A`) REFERENCES `CourseSession` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_CourseSessionToFile_B_fkey` FOREIGN KEY (`B`) REFERENCES `File` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_CourseSessionToFile`
--

LOCK TABLES `_CourseSessionToFile` WRITE;
/*!40000 ALTER TABLE `_CourseSessionToFile` DISABLE KEYS */;
INSERT INTO `_CourseSessionToFile` VALUES (2234,'x1'),(2236,'x1'),(2237,'x1'),(2238,'x1'),(2245,'x1'),(2247,'x1'),(2248,'x1'),(2249,'x1'),(2254,'x1'),(2257,'x1'),(2261,'x1'),(2262,'x1'),(2264,'x1'),(2268,'x1'),(2269,'x1'),(2273,'x1'),(2276,'x1'),(2277,'x1'),(2279,'x1'),(2282,'x1'),(2283,'x1'),(2285,'x1'),(2289,'x1'),(2294,'x1'),(2301,'x1'),(2302,'x1'),(2303,'x1'),(2310,'x1'),(2319,'x1'),(2320,'x1'),(2326,'x1'),(2327,'x1'),(2336,'x1'),(2337,'x1'),(2343,'x1'),(2344,'x1'),(2351,'x1'),(2352,'x1'),(2239,'x2'),(2241,'x2'),(2242,'x2'),(2243,'x2'),(2244,'x2'),(2247,'x2'),(2249,'x2'),(2250,'x2'),(2252,'x2'),(2253,'x2'),(2261,'x2'),(2264,'x2'),(2267,'x2'),(2269,'x2'),(2271,'x2'),(2276,'x2'),(2286,'x2'),(2290,'x2'),(2293,'x2'),(2296,'x2'),(2299,'x2'),(2300,'x2'),(2302,'x2'),(2305,'x2'),(2307,'x2'),(2310,'x2'),(2311,'x2'),(2315,'x2'),(2316,'x2'),(2317,'x2'),(2320,'x2'),(2323,'x2'),(2325,'x2'),(2326,'x2'),(2328,'x2'),(2329,'x2'),(2336,'x2'),(2338,'x2'),(2350,'x2'),(2234,'x3'),(2237,'x3'),(2239,'x3'),(2243,'x3'),(2244,'x3'),(2248,'x3'),(2250,'x3'),(2254,'x3'),(2255,'x3'),(2258,'x3'),(2261,'x3'),(2263,'x3'),(2269,'x3'),(2272,'x3'),(2273,'x3'),(2275,'x3'),(2276,'x3'),(2288,'x3'),(2289,'x3'),(2291,'x3'),(2302,'x3'),(2309,'x3'),(2315,'x3'),(2319,'x3'),(2321,'x3'),(2324,'x3'),(2326,'x3'),(2329,'x3'),(2330,'x3'),(2331,'x3'),(2333,'x3'),(2336,'x3'),(2337,'x3'),(2338,'x3'),(2341,'x3'),(2343,'x3'),(2351,'x3'),(2234,'x4'),(2237,'x4'),(2238,'x4'),(2241,'x4'),(2244,'x4'),(2248,'x4'),(2254,'x4'),(2256,'x4'),(2267,'x4'),(2268,'x4'),(2269,'x4'),(2270,'x4'),(2271,'x4'),(2272,'x4'),(2274,'x4'),(2277,'x4'),(2284,'x4'),(2292,'x4'),(2293,'x4'),(2296,'x4'),(2301,'x4'),(2302,'x4'),(2307,'x4'),(2309,'x4'),(2314,'x4'),(2315,'x4'),(2319,'x4'),(2324,'x4'),(2326,'x4'),(2329,'x4'),(2331,'x4'),(2332,'x4'),(2336,'x4'),(2337,'x4'),(2338,'x4'),(2340,'x4'),(2343,'x4'),(2344,'x4'),(2345,'x4'),(2348,'x4'),(2350,'x4'),(2244,'x5'),(2249,'x5'),(2253,'x5'),(2254,'x5'),(2256,'x5'),(2258,'x5'),(2260,'x5'),(2261,'x5'),(2265,'x5'),(2267,'x5'),(2270,'x5'),(2273,'x5'),(2280,'x5'),(2283,'x5'),(2288,'x5'),(2289,'x5'),(2293,'x5'),(2296,'x5'),(2309,'x5'),(2310,'x5'),(2314,'x5'),(2315,'x5'),(2316,'x5'),(2319,'x5'),(2322,'x5'),(2324,'x5'),(2325,'x5'),(2329,'x5'),(2331,'x5'),(2334,'x5'),(2337,'x5'),(2338,'x5'),(2341,'x5'),(2343,'x5'),(2344,'x5'),(2348,'x5'),(2350,'x5'),(2243,'x6'),(2249,'x6'),(2253,'x6'),(2258,'x6'),(2267,'x6'),(2268,'x6'),(2270,'x6'),(2275,'x6'),(2282,'x6'),(2289,'x6'),(2292,'x6'),(2296,'x6'),(2299,'x6'),(2301,'x6'),(2302,'x6'),(2303,'x6'),(2309,'x6'),(2311,'x6'),(2313,'x6'),(2316,'x6'),(2317,'x6'),(2320,'x6'),(2321,'x6'),(2323,'x6'),(2331,'x6'),(2333,'x6'),(2343,'x6'),(2346,'x6'),(2348,'x6'),(2350,'x6'),(2238,'x7'),(2240,'x7'),(2242,'x7'),(2243,'x7'),(2244,'x7'),(2248,'x7'),(2250,'x7'),(2251,'x7'),(2258,'x7'),(2261,'x7'),(2262,'x7'),(2265,'x7'),(2270,'x7'),(2276,'x7'),(2282,'x7'),(2284,'x7'),(2286,'x7'),(2287,'x7'),(2292,'x7'),(2293,'x7'),(2296,'x7'),(2298,'x7'),(2303,'x7'),(2304,'x7'),(2306,'x7'),(2307,'x7'),(2311,'x7'),(2316,'x7'),(2321,'x7'),(2324,'x7'),(2331,'x7'),(2332,'x7'),(2344,'x7'),(2346,'x7'),(2350,'x7'),(2352,'x7'),(2234,'x8'),(2247,'x8'),(2248,'x8'),(2249,'x8'),(2251,'x8'),(2254,'x8'),(2256,'x8'),(2258,'x8'),(2260,'x8'),(2262,'x8'),(2263,'x8'),(2264,'x8'),(2267,'x8'),(2268,'x8'),(2271,'x8'),(2272,'x8'),(2274,'x8'),(2276,'x8'),(2277,'x8'),(2282,'x8'),(2284,'x8'),(2300,'x8'),(2301,'x8'),(2303,'x8'),(2304,'x8'),(2307,'x8'),(2308,'x8'),(2314,'x8'),(2315,'x8'),(2316,'x8'),(2319,'x8'),(2320,'x8'),(2326,'x8'),(2332,'x8'),(2337,'x8'),(2344,'x8'),(2345,'x8'),(2348,'x8'),(2351,'x8'),(2352,'x8');
/*!40000 ALTER TABLE `_CourseSessionToFile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_lecturers`
--

DROP TABLE IF EXISTS `_lecturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_lecturers` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_lecturers_AB_unique` (`A`,`B`),
  KEY `_lecturers_B_index` (`B`),
  CONSTRAINT `_lecturers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_lecturers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_lecturers`
--

LOCK TABLES `_lecturers` WRITE;
/*!40000 ALTER TABLE `_lecturers` DISABLE KEYS */;
INSERT INTO `_lecturers` VALUES (237,8900),(238,8900),(242,8900),(244,8900),(245,8900),(236,8901),(237,8901),(238,8901),(240,8901),(241,8901),(242,8901),(243,8901),(246,8901),(235,8902),(239,8902),(240,8902),(241,8902);
/*!40000 ALTER TABLE `_lecturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_students`
--

DROP TABLE IF EXISTS `_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_students` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_students_AB_unique` (`A`,`B`),
  KEY `_students_B_index` (`B`),
  CONSTRAINT `_students_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_students_B_fkey` FOREIGN KEY (`B`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_students`
--

LOCK TABLES `_students` WRITE;
/*!40000 ALTER TABLE `_students` DISABLE KEYS */;
INSERT INTO `_students` VALUES (235,9900),(237,9900),(239,9900),(240,9900),(243,9900),(244,9900),(235,9901),(237,9901),(238,9901),(245,9901),(238,9902),(239,9902),(241,9902),(242,9902),(244,9902),(246,9902),(236,9903),(238,9903),(239,9903),(240,9903),(242,9903),(237,9904),(240,9904),(243,9904),(246,9904),(236,9905),(239,9905),(240,9905),(242,9905),(243,9905),(246,9905),(236,9906),(241,9906),(245,9906),(236,9907),(237,9907),(238,9907),(240,9907),(241,9907),(242,9907),(237,9908),(241,9908),(245,9908),(246,9908),(236,9909),(237,9909),(240,9909),(241,9909),(242,9909),(243,9909),(244,9909),(237,9910),(238,9910),(240,9910),(245,9910),(240,9911),(243,9911),(245,9911),(235,9912),(242,9912),(244,9912),(246,9912),(235,9913),(238,9913),(241,9913),(243,9913),(245,9913),(244,9999),(246,9999);
/*!40000 ALTER TABLE `_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_users`
--

DROP TABLE IF EXISTS `_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_users` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_users_AB_unique` (`A`,`B`),
  KEY `_users_B_index` (`B`),
  CONSTRAINT `_users_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_users_B_fkey` FOREIGN KEY (`B`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_users`
--

LOCK TABLES `_users` WRITE;
/*!40000 ALTER TABLE `_users` DISABLE KEYS */;
INSERT INTO `_users` VALUES (237,8900),(238,8900),(242,8900),(244,8900),(245,8900),(236,8901),(237,8901),(238,8901),(240,8901),(241,8901),(242,8901),(243,8901),(246,8901),(235,8902),(239,8902),(240,8902),(241,8902),(235,9900),(237,9900),(239,9900),(240,9900),(243,9900),(244,9900),(235,9901),(237,9901),(238,9901),(245,9901),(238,9902),(239,9902),(241,9902),(242,9902),(244,9902),(246,9902),(236,9903),(238,9903),(239,9903),(240,9903),(242,9903),(237,9904),(240,9904),(243,9904),(246,9904),(236,9905),(239,9905),(240,9905),(242,9905),(243,9905),(246,9905),(236,9906),(241,9906),(245,9906),(236,9907),(237,9907),(238,9907),(240,9907),(241,9907),(242,9907),(237,9908),(241,9908),(245,9908),(246,9908),(236,9909),(237,9909),(240,9909),(241,9909),(242,9909),(243,9909),(244,9909),(237,9910),(238,9910),(240,9910),(245,9910),(240,9911),(243,9911),(245,9911),(235,9912),(242,9912),(244,9912),(246,9912),(235,9913),(238,9913),(241,9913),(243,9913),(245,9913),(244,9999),(246,9999);
/*!40000 ALTER TABLE `_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-27 22:49:22
