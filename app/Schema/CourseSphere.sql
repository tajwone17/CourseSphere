-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2025 at 08:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coursesphere`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_admin`
--

CREATE TABLE `accounts_admin` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `PHONE` varchar(20) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT 1,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts_admin`
--

INSERT INTO `accounts_admin` (`ID`, `NAME`, `EMAIL`, `PASSWORD`, `PHONE`, `STATUS`, `CREATED_AT`) VALUES
(2, 'Jakaria Chowdhury Tajwone', '0562310005101031@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-05-22 05:59:32'),
(3, 'Tajwone Chowdhury', 'aoli23511@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-06-10 09:54:50'),
(4, 'Tajwone Chowdhury', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-06-10 16:57:04'),
(5, 'MR Shahrukh KHan', 'tajwone249@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '083749494i', 1, '2025-06-10 18:09:27');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`ID`, `NAME`, `EMAIL`, `PASSWORD`, `CREATED_AT`) VALUES
(1, 'Super Administrator', 'superadmin@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '2025-05-19 18:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `advisor`
--

CREATE TABLE `advisor` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `DEPARTMENT_ID` int(11) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `STATUS` tinyint(1) DEFAULT 1,
  `PHONE` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `advisor`
--

INSERT INTO `advisor` (`ID`, `NAME`, `EMAIL`, `PASSWORD`, `DEPARTMENT_ID`, `CREATED_AT`, `STATUS`, `PHONE`) VALUES
(1, 'Tajwone Chowdhury', 'aoli23511@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 4, '2025-05-20 18:45:30', 0, '01720671208'),
(4, 'Tajwone Chowdhury', 'dgcvsdg@gmail.cpm', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-09 19:15:58', 1, '01765921728'),
(5, 'Jakaria Chowdhury Tajwone', 'kkabirsingh2510@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-09 19:25:17', 1, '01720671208'),
(7, 'Tajwone Chowdhury', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-09 19:57:32', 1, '01765921728'),
(8, 'Mohammad Aksar', '0562310005101031@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-10 06:38:30', 1, '01765921728');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `ID` int(11) NOT NULL,
  `TITLE` varchar(100) NOT NULL,
  `CODE` varchar(20) NOT NULL,
  `CREDIT` decimal(3,1) NOT NULL,
  `DEPARTMENT_ID` int(11) NOT NULL,
  `STATUS` tinyint(1) DEFAULT 1,
  `INSTRUCTOR_NAME` varchar(100) DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`ID`, `TITLE`, `CODE`, `CREDIT`, `DEPARTMENT_ID`, `STATUS`, `INSTRUCTOR_NAME`, `CREATED_AT`) VALUES
(1, 'dms', 'CSE-012', 3.0, 3, 1, 'TAJWONE VAI', '2025-06-11 18:47:31'),
(4, 'SEDP', 'CSE-012', 3.0, 3, 1, 'SCP', '2025-06-11 19:23:58'),
(5, 'Ai', 'CSE-019', 3.0, 3, 1, 'TAJWONE', '2025-07-09 08:54:01'),
(6, 'SEDP', 'CSE-112', 3.0, 1, 1, 'Sabuj Chandra Paul', '2025-07-09 14:25:31');

-- --------------------------------------------------------

--
-- Table structure for table `course_cart`
--

CREATE TABLE `course_cart` (
  `ID` int(11) NOT NULL,
  `USER_ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `STATUS` tinyint(1) DEFAULT 0,
  `ADDED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course_registration`
--

CREATE TABLE `course_registration` (
  `ID` int(11) NOT NULL,
  `BUNDLE_ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `ADVISOR_ID` int(11) DEFAULT NULL,
  `STATUS` enum('PENDING','APPROVED','REJECTED','COMPLETED') DEFAULT 'PENDING',
  `ADVISOR_COMMENT` text DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deadlines`
--

CREATE TABLE `deadlines` (
  `id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `course_registration_without_fine` date DEFAULT NULL,
  `course_registration_with_fine` date DEFAULT NULL,
  `admit_card_collection` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deadlines`
--

INSERT INTO `deadlines` (`id`, `department_id`, `course_registration_without_fine`, `course_registration_with_fine`, `admit_card_collection`) VALUES
(1, 3, '2025-06-13', '2025-06-14', '2025-07-03');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `ID` int(11) NOT NULL,
  `DEPARTMENT_NAME` varchar(100) NOT NULL,
  `AMOUNT_PER_CREDIT` decimal(10,2) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`ID`, `DEPARTMENT_NAME`, `AMOUNT_PER_CREDIT`, `CREATED_AT`) VALUES
(1, 'CSE', 1500.00, '2025-05-13 19:47:22'),
(2, 'EEE', 1400.00, '2025-05-13 19:47:22'),
(3, 'BBA', 1300.00, '2025-05-13 19:47:22'),
(4, 'English', 1200.00, '2025-05-13 19:47:22');

-- --------------------------------------------------------

--
-- Table structure for table `exam_controller`
--

CREATE TABLE `exam_controller` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `PHONE` varchar(20) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT 1,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_controller`
--

INSERT INTO `exam_controller` (`ID`, `NAME`, `EMAIL`, `PASSWORD`, `PHONE`, `STATUS`, `CREATED_AT`) VALUES
(2, 'Jakaria Chowdhury Tajwone', '0562310005101031@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '083749494', 0, '2025-05-20 19:05:57'),
(3, 'Tajwone Chowdhury', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 0, '2025-06-10 16:56:37'),
(5, 'Mr salman Khan', 'tajwone249@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-07-03 17:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `hod`
--

CREATE TABLE `hod` (
  `ID` int(11) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `DEPARTMENT_ID` int(11) NOT NULL,
  `STATUS` tinyint(1) DEFAULT 1,
  `PHONE` varchar(20) DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hod`
--

INSERT INTO `hod` (`ID`, `NAME`, `EMAIL`, `PASSWORD`, `DEPARTMENT_ID`, `STATUS`, `PHONE`, `CREATED_AT`) VALUES
(1, 'Tajwone Chowdhury', '0562310005101031@neub.edu.bd', '08168200d5149fb1', 1, 0, '947463303', '2025-05-20 14:55:40'),
(7, 'mst.fahimajjaman jaina', 'fahimajaina765@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 1, '01765921728', '2025-05-21 05:13:26'),
(8, 'Sathi Akter', '0562310005101045@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, 1, '01765921728', '2025-05-21 05:14:58'),
(9, 'Tajwone Chowdhury', 'kkabirsingh2510@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 1, '01765921728', '2025-06-10 08:07:17'),
(10, 'Tajwone Chowdhury', 'tajwone249@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, 1, '01765921728', '2025-06-10 08:10:14'),
(11, 'Tajwone Chowdhury', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 1, '01765921728', '2025-07-09 14:23:57');

-- --------------------------------------------------------

--
-- Table structure for table `notice`
--

CREATE TABLE `notice` (
  `ID` int(11) NOT NULL,
  `TITLE` varchar(255) NOT NULL,
  `DESCRIPTION` text DEFAULT NULL,
  `CREATOR_ID` int(11) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notice`
--

INSERT INTO `notice` (`ID`, `TITLE`, `DESCRIPTION`, `CREATOR_ID`, `CREATED_AT`) VALUES
(10, 'SHeikh Hasina palay na', '5 th July sheikh hasina polaise', 11, '2025-07-09 14:28:08');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `ID` int(11) NOT NULL,
  `BUNDLE_ID` int(11) NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `STATUS` enum('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
  `PAYMENT_METHOD` varchar(50) DEFAULT 'Online',
  `TRANSACTION_ID` varchar(100) DEFAULT NULL,
  `PAYMENT_DATE` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prerequisite`
--

CREATE TABLE `prerequisite` (
  `ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `PREREQ_COURSE_ID` int(11) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prerequisite`
--

INSERT INTO `prerequisite` (`ID`, `COURSE_ID`, `PREREQ_COURSE_ID`, `CREATED_AT`) VALUES
(1, 5, 1, '2025-07-09 08:54:01');

-- --------------------------------------------------------

--
-- Table structure for table `registered_courses`
--

CREATE TABLE `registered_courses` (
  `ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
  `REGISTRATION_DATE` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registration_bundle`
--

CREATE TABLE `registration_bundle` (
  `ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
  `STATUS` enum('PENDING','PARTIALLY_APPROVED','APPROVED','REJECTED','COMPLETED') DEFAULT 'PENDING',
  `HOD_APPROVAL` tinyint(1) DEFAULT 0,
  `ADVISOR_APPROVAL` tinyint(1) DEFAULT 0,
  `ACCOUNTS_ADMIN_APPROVAL` tinyint(1) DEFAULT 0,
  `SUBMITTED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `PAYMENT_STATUS` enum('PENDING','PAID','PARTIALLY_PAID','WAIVED') DEFAULT 'PENDING',
  `TOTAL_AMOUNT` decimal(10,2) DEFAULT 0.00,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registration_deadline`
--

CREATE TABLE `registration_deadline` (
  `ID` int(11) NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
  `DEADLINE_DATE` date NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `GRADE` enum('A+','A','A-','B+','B','B-','C+','C','D','F') NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `ID` int(11) NOT NULL,
  `REGISTRATION_NUMBER` varchar(50) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `DEPARTMENT_ID` int(11) NOT NULL,
  `SESSION` varchar(10) DEFAULT NULL,
  `MOBILE` varchar(20) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT 0,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`ID`, `REGISTRATION_NUMBER`, `NAME`, `EMAIL`, `PASSWORD`, `DEPARTMENT_ID`, `SESSION`, `MOBILE`, `STATUS`, `CREATED_AT`) VALUES
(1, '0562310005101031', 'Jakaria Chowdhury Tajwone', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'Fall-2022', '01703758327', 1, '2025-05-13 19:48:50'),
(2, '0562310005101003', 'Tajwone Chowdhury', 'tajwone249@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, 'Spring-202', '01703758327', 0, '2025-05-13 20:14:04'),
(3, '0562310005101019', 'tajwone17', '0562310005101031@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, 'Spring-202', NULL, 0, '2025-05-13 20:53:54'),
(4, '0562310005101018', 'mohammed oli', 'dgcvsdg@gmail.cpm', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'Summer-202', '01703758327', 0, '2025-05-16 21:08:31'),
(5, '0562310005101005', 'Masum Pradhania', 'masumbillah@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, 'Fall-2020', '01702383920', 1, '2025-05-19 17:47:13'),
(6, '056231000037', 'Jakaria', 'tajwoe247tc@gmai.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'Spring-202', '01703758327', 0, '2025-05-20 18:11:15');

-- --------------------------------------------------------

--
-- Table structure for table `verification`
--

CREATE TABLE `verification` (
  `ID` int(11) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `TYPE` enum('PASSWORD_RESET','EMAIL_VERIFICATION') NOT NULL,
  `OTP` varchar(6) NOT NULL,
  `EXPIRES_AT` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `IS_USED` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification`
--

INSERT INTO `verification` (`ID`, `EMAIL`, `TYPE`, `OTP`, `EXPIRES_AT`, `CREATED_AT`, `IS_USED`) VALUES
(1, 'tajwone248tc@gmail.com', 'PASSWORD_RESET', '481056', '2025-07-09 07:02:51', '2025-07-09 07:01:30', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_admin`
--
ALTER TABLE `accounts_admin`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `advisor`
--
ALTER TABLE `advisor`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`),
  ADD KEY `DEPARTMENT_ID` (`DEPARTMENT_ID`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `DEPARTMENT_ID` (`DEPARTMENT_ID`);

--
-- Indexes for table `course_cart`
--
ALTER TABLE `course_cart`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `USER_COURSE` (`USER_ID`,`COURSE_ID`),
  ADD KEY `COURSE_ID` (`COURSE_ID`);

--
-- Indexes for table `course_registration`
--
ALTER TABLE `course_registration`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `BUNDLE_ID` (`BUNDLE_ID`,`COURSE_ID`),
  ADD KEY `COURSE_ID` (`COURSE_ID`),
  ADD KEY `ADVISOR_ID` (`ADVISOR_ID`);

--
-- Indexes for table `deadlines`
--
ALTER TABLE `deadlines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `exam_controller`
--
ALTER TABLE `exam_controller`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`);

--
-- Indexes for table `hod`
--
ALTER TABLE `hod`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`),
  ADD KEY `DEPARTMENT_ID` (`DEPARTMENT_ID`);

--
-- Indexes for table `notice`
--
ALTER TABLE `notice`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CREATOR_ID` (`CREATOR_ID`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `BUNDLE_ID` (`BUNDLE_ID`);

--
-- Indexes for table `prerequisite`
--
ALTER TABLE `prerequisite`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `COURSE_ID` (`COURSE_ID`,`PREREQ_COURSE_ID`),
  ADD KEY `PREREQ_COURSE_ID` (`PREREQ_COURSE_ID`);

--
-- Indexes for table `registered_courses`
--
ALTER TABLE `registered_courses`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `COURSE_ID` (`COURSE_ID`),
  ADD KEY `STUDENT_ID` (`STUDENT_ID`);

--
-- Indexes for table `registration_bundle`
--
ALTER TABLE `registration_bundle`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `STUDENT_ID` (`STUDENT_ID`,`SEMESTER`);

--
-- Indexes for table `registration_deadline`
--
ALTER TABLE `registration_deadline`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `STUDENT_ID` (`STUDENT_ID`),
  ADD KEY `COURSE_ID` (`COURSE_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `REGISTRATION_NUMBER` (`REGISTRATION_NUMBER`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`),
  ADD KEY `DEPARTMENT_ID` (`DEPARTMENT_ID`);

--
-- Indexes for table `verification`
--
ALTER TABLE `verification`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `EMAIL` (`EMAIL`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_admin`
--
ALTER TABLE `accounts_admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `advisor`
--
ALTER TABLE `advisor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `course_cart`
--
ALTER TABLE `course_cart`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course_registration`
--
ALTER TABLE `course_registration`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deadlines`
--
ALTER TABLE `deadlines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `exam_controller`
--
ALTER TABLE `exam_controller`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hod`
--
ALTER TABLE `hod`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prerequisite`
--
ALTER TABLE `prerequisite`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `registered_courses`
--
ALTER TABLE `registered_courses`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration_bundle`
--
ALTER TABLE `registration_bundle`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `registration_deadline`
--
ALTER TABLE `registration_deadline`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `verification`
--
ALTER TABLE `verification`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `advisor`
--
ALTER TABLE `advisor`
  ADD CONSTRAINT `advisor_ibfk_1` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `course_cart`
--
ALTER TABLE `course_cart`
  ADD CONSTRAINT `course_cart_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `student` (`ID`),
  ADD CONSTRAINT `course_cart_ibfk_2` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`);

--
-- Constraints for table `course_registration`
--
ALTER TABLE `course_registration`
  ADD CONSTRAINT `course_registration_ibfk_1` FOREIGN KEY (`BUNDLE_ID`) REFERENCES `registration_bundle` (`ID`),
  ADD CONSTRAINT `course_registration_ibfk_2` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`),
  ADD CONSTRAINT `course_registration_ibfk_3` FOREIGN KEY (`ADVISOR_ID`) REFERENCES `advisor` (`ID`);

--
-- Constraints for table `deadlines`
--
ALTER TABLE `deadlines`
  ADD CONSTRAINT `deadlines_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`ID`);

--
-- Constraints for table `hod`
--
ALTER TABLE `hod`
  ADD CONSTRAINT `hod_ibfk_1` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`);

--
-- Constraints for table `notice`
--
ALTER TABLE `notice`
  ADD CONSTRAINT `notice_ibfk_1` FOREIGN KEY (`CREATOR_ID`) REFERENCES `hod` (`ID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`BUNDLE_ID`) REFERENCES `registration_bundle` (`ID`);

--
-- Constraints for table `prerequisite`
--
ALTER TABLE `prerequisite`
  ADD CONSTRAINT `prerequisite_ibfk_1` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`),
  ADD CONSTRAINT `prerequisite_ibfk_2` FOREIGN KEY (`PREREQ_COURSE_ID`) REFERENCES `course` (`ID`);

--
-- Constraints for table `registered_courses`
--
ALTER TABLE `registered_courses`
  ADD CONSTRAINT `registered_courses_ibfk_1` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`),
  ADD CONSTRAINT `registered_courses_ibfk_2` FOREIGN KEY (`STUDENT_ID`) REFERENCES `student` (`ID`);

--
-- Constraints for table `registration_bundle`
--
ALTER TABLE `registration_bundle`
  ADD CONSTRAINT `registration_bundle_ibfk_1` FOREIGN KEY (`STUDENT_ID`) REFERENCES `student` (`ID`);

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`STUDENT_ID`) REFERENCES `student` (`ID`),
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`DEPARTMENT_ID`) REFERENCES `department` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
