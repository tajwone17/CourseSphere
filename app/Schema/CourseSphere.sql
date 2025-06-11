-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 09:32 PM
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
(1, 'Super Administrator', 'superadmin@neub.edu.bd', '$2b$12$o2eZeSjSISMNx3hWFj4d8Om8Di8gDN1yzaHOZQZMZDUoF1Tl6FMDq', '2025-05-19 18:01:22');

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

-- --------------------------------------------------------

--
-- Table structure for table `course_cart`
--

CREATE TABLE `course_cart` (
  `ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
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
  `ID` int(11) NOT NULL,
  `TITLE` varchar(100) DEFAULT NULL,
  `PRIORITY` enum('URGENT') DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `DEADLINE_DATE` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `ID` int(11) NOT NULL,
  `BUNDLE_ID` int(11) NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `STATUS` enum('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
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

-- --------------------------------------------------------

--
-- Table structure for table `registered_courses`
--

CREATE TABLE `registered_courses` (
  `ID` int(11) NOT NULL,
  `COURSE_ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL
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
  ADD UNIQUE KEY `STUDENT_ID` (`STUDENT_ID`,`COURSE_ID`,`SEMESTER`),
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
  ADD PRIMARY KEY (`ID`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_admin`
--
ALTER TABLE `accounts_admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `advisor`
--
ALTER TABLE `advisor`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exam_controller`
--
ALTER TABLE `exam_controller`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hod`
--
ALTER TABLE `hod`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notice`
--
ALTER TABLE `notice`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `prerequisite`
--
ALTER TABLE `prerequisite`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `course_cart_ibfk_1` FOREIGN KEY (`STUDENT_ID`) REFERENCES `student` (`ID`),
  ADD CONSTRAINT `course_cart_ibfk_2` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`);

--
-- Constraints for table `course_registration`
--
ALTER TABLE `course_registration`
  ADD CONSTRAINT `course_registration_ibfk_1` FOREIGN KEY (`BUNDLE_ID`) REFERENCES `registration_bundle` (`ID`),
  ADD CONSTRAINT `course_registration_ibfk_2` FOREIGN KEY (`COURSE_ID`) REFERENCES `course` (`ID`),
  ADD CONSTRAINT `course_registration_ibfk_3` FOREIGN KEY (`ADVISOR_ID`) REFERENCES `advisor` (`ID`);

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
