-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2025 at 09:22 AM
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
(1, 'Khadem Asifuzzaman', 'asif@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, '2025-05-20 18:45:30', 1, '01720671208'),
(4, 'Parvej Ahmed', 'parvez@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-09 19:15:58', 1, '01765921728'),
(5, 'Razorshi Prozzwal Taluker', 'rajorshee@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, '2025-06-09 19:25:17', 1, '01720671208'),
(7, 'Rathindra Gope', 'Rathindra@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-06-09 19:57:32', 1, '01765921728'),
(8, 'Md. Abdul Karim', 'karim@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, '2025-07-10 09:00:00', 1, '01711112222'),
(9, 'Mohammad Hasan', 'hasan@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, '2025-07-10 09:05:00', 1, '01722223333'),
(10, 'Md. Shafiqul Islam', 'shafiqul@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 4, '2025-07-10 09:10:00', 1, '01733334444'),
(11, 'Abdul Matin', 'matin@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, '2025-07-10 09:15:00', 1, '01744445555'),
(12, 'Md. Nurul Islam', 'nurul@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 4, '2025-07-10 09:20:00', 1, '01755556666');

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
(1, 'Software Engineering', 'CSE-0123456', 3.0, 3, 1, 'Mr. Sabuj Chandra Paul', '2025-06-11 18:47:31'),
(2, 'Data Structures', 'CSE-1001', 3.0, 1, 1, 'Prof. Nusrat Jahan', '2025-07-10 09:00:00'),
(3, 'Algorithms', 'CSE-1002', 3.0, 1, 1, 'Prof. Mahmudul Hasan', '2025-07-10 09:05:00'),
(4, 'Operating Systems', 'CSE-1003', 3.0, 1, 1, 'Prof. Shamsul Alam', '2025-07-10 09:10:00'),
(5, 'Computer Lab', 'CSE-1101L', 1.5, 1, 1, 'Prof. Farhana Islam', '2025-07-10 09:15:00'),
(6, 'Constitutional Law', 'LAW-5001', 3.0, 2, 1, 'Prof. Kamrul Hasan', '2025-07-10 09:20:00'),
(7, 'Criminal Law', 'LAW-5002', 3.0, 2, 1, 'Prof. Rasheda Begum', '2025-07-10 09:25:00'),
(8, 'Civil Procedure', 'LAW-5003', 3.0, 2, 1, 'Prof. Tanvir Ahmed', '2025-07-10 09:30:00'),
(9, 'Law Lab', 'LAW-5101L', 1.5, 2, 1, 'Prof. Shafiqul Islam', '2025-07-10 09:35:00'),
(10, 'Principles of Management', 'BBA-3001', 3.0, 3, 1, 'Parvej Ahmed', '2025-07-10 09:40:00'),
(11, 'Marketing Fundamentals', 'BBA-3002', 3.0, 3, 1, 'Razorshee Prozzwal Talukder', '2025-07-10 09:45:00'),
(12, 'Financial Accounting', 'BBA-3003', 3.0, 3, 1, 'Khadem Asifuzzaman', '2025-07-10 09:50:00'),
(13, 'Business Lab', 'BBA-3101L', 1.5, 3, 1, 'Md. Abdul Karim', '2025-07-10 09:55:00'),
(14, 'English Literature', 'ENG-4001', 3.0, 4, 1, 'Md. Shafiqul Islam', '2025-07-10 10:00:00'),
(15, 'Linguistics', 'ENG-4002', 3.0, 4, 1, 'Md. Nurul Islam', '2025-07-10 10:05:00'),
(16, 'Creative Writing', 'ENG-4003', 3.0, 4, 1, 'Abdul Matin', '2025-07-10 10:10:00'),
(17, 'Language Lab', 'ENG-4101L', 1.5, 4, 1, 'Md. Shafiqul Islam', '2025-07-10 10:15:00'),
(18, 'Structured Programming Language', 'CSE-1256', 3.0, 1, 1, 'Ayon Dey', '2025-07-15 13:56:04');

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
  `STATUS` enum('PENDING','APPROVED','REJECTED','COMPLETED','CANCELLED') DEFAULT NULL,
  `ADVISOR_COMMENT` text DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_registration`
--

INSERT INTO `course_registration` (`ID`, `BUNDLE_ID`, `COURSE_ID`, `ADVISOR_ID`, `STATUS`, `ADVISOR_COMMENT`, `CREATED_AT`) VALUES
(1, 1, 3, 1, 'COMPLETED', 'You are not eligible to take the computer Lab course.', '2025-07-15 07:37:22'),
(2, 1, 2, 1, 'COMPLETED', 'You are not eligible to take the computer Lab course.', '2025-07-15 07:37:22'),
(3, 1, 5, 1, 'REJECTED', 'You are not eligible to take the computer Lab course.', '2025-07-15 07:37:22'),
(4, 1, 4, 1, 'COMPLETED', 'You are not eligible to take the computer Lab course.', '2025-07-15 07:37:22'),
(5, 2, 5, 1, 'COMPLETED', NULL, '2025-07-15 08:04:43'),
(6, 3, 18, 1, 'COMPLETED', NULL, '2025-07-15 13:57:54'),
(7, 4, 2, 1, 'COMPLETED', 'You are not eligible for this course.', '2025-07-15 17:44:10'),
(8, 4, 3, 1, 'COMPLETED', 'You are not eligible for this course.', '2025-07-15 17:44:10'),
(9, 4, 4, 1, 'COMPLETED', 'You are not eligible for this course.', '2025-07-15 17:44:10'),
(10, 4, 5, 1, 'REJECTED', 'You are not eligible for this course.', '2025-07-15 17:44:10'),
(11, 5, 2, 1, 'REJECTED', NULL, '2025-07-15 18:34:23'),
(12, 6, 18, 1, 'CANCELLED', NULL, '2025-07-15 18:40:00'),
(13, 6, 4, 1, 'CANCELLED', NULL, '2025-07-15 18:40:00'),
(14, 7, 4, 1, 'CANCELLED', NULL, '2025-07-15 19:25:47');

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
(2, 1, '2025-07-22', '2025-07-26', '2025-08-02');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `ID` int(11) NOT NULL,
  `DEPARTMENT_NAME` varchar(100) NOT NULL,
  `AMOUNT_PER_CREDIT` decimal(10,2) NOT NULL,
  `TOTAL_CREDITS` int(11) DEFAULT 0,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`ID`, `DEPARTMENT_NAME`, `AMOUNT_PER_CREDIT`, `TOTAL_CREDITS`, `CREATED_AT`) VALUES
(1, 'CSE', 3000.00, 160, '2025-05-13 19:47:22'),
(2, 'LLB', 2500.00, 155, '2025-05-13 19:47:22'),
(3, 'BBA', 2000.00, 140, '2025-05-13 19:47:22'),
(4, 'English', 1500.00, 135, '2025-05-13 19:47:22');

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
(2, 'Shakib Al Hasan', 'shakib@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '0183749494', 1, '2025-05-20 19:05:57'),
(3, 'Tajwone Chowdhury', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-06-10 16:56:37'),
(5, 'Mr Abdul Karim', 'karim249@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', '01765921728', 1, '2025-07-03 17:41:37');

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
(1, 'Dr. Arif Ahmed', 'arifahmed.cse@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 1, '01711112222', '2025-07-10 09:00:00'),
(2, 'Dr. Fatema Begum', 'fatemabegum.llb@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, 1, '01722223333', '2025-07-10 09:05:00'),
(3, 'Dr. Mohammad Hasan', 'mhasan.bba@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, 1, '01733334444', '2025-07-10 09:10:00'),
(4, 'Dr. Nurul Islam', 'nurulislam.eng@neub.edu.bd', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 4, 1, '01744445555', '2025-07-10 09:15:00');

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
(11, 'Notice for Course Registration', 'This is for the information of all concerned students of North East University Bangladesh (NEUB) that the Course Registration and Classes of the SummerSemester - 2025 has been started from July 15, 2025 (Tuesday).\nAll are advised to complete their Course Registration (without any delay fine) .', 1, '2025-07-15 07:02:37');

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

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`ID`, `BUNDLE_ID`, `AMOUNT`, `STATUS`, `PAYMENT_METHOD`, `TRANSACTION_ID`, `PAYMENT_DATE`, `CREATED_AT`) VALUES
(1, 1, 13700.00, 'COMPLETED', 'Bank Transfer', NULL, '2025-07-15 07:46:56', '2025-07-15 07:46:56'),
(2, 2, 2250.00, 'COMPLETED', 'Credit Card', NULL, '2025-07-15 08:06:55', '2025-07-15 08:06:55'),
(3, 3, 4700.00, 'COMPLETED', 'Credit Card', NULL, '2025-07-15 14:04:02', '2025-07-15 14:04:02'),
(4, 4, 13700.00, 'COMPLETED', 'Credit Card', NULL, '2025-07-15 17:47:45', '2025-07-15 17:47:45');

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
(1, 3, 2, '2025-07-15 09:00:00'),
(2, 4, 3, '2025-07-15 09:01:00'),
(3, 11, 10, '2025-07-15 09:02:00'),
(4, 12, 10, '2025-07-15 09:03:00'),
(5, 13, 12, '2025-07-15 09:04:00'),
(6, 15, 14, '2025-07-15 09:05:00'),
(7, 16, 15, '2025-07-15 09:06:00'),
(8, 17, 14, '2025-07-15 09:07:00'),
(9, 7, 6, '2025-07-15 09:08:00'),
(10, 8, 6, '2025-07-15 09:09:00'),
(11, 9, 8, '2025-07-15 09:10:00');

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

--
-- Dumping data for table `registered_courses`
--

INSERT INTO `registered_courses` (`ID`, `COURSE_ID`, `STUDENT_ID`, `SEMESTER`, `REGISTRATION_DATE`) VALUES
(1, 3, 1, 'Summer-2025', '2025-07-15 07:46:56'),
(2, 2, 1, 'Summer-2025', '2025-07-15 07:46:56'),
(3, 4, 1, 'Summer-2025', '2025-07-15 07:46:56'),
(4, 5, 1, 'Summer-2025', '2025-07-15 08:06:55'),
(5, 18, 1, 'Summer-2025', '2025-07-15 14:04:02'),
(6, 2, 5, 'Summer-2025', '2025-07-15 17:47:45'),
(7, 3, 5, 'Summer-2025', '2025-07-15 17:47:45'),
(8, 4, 5, 'Summer-2025', '2025-07-15 17:47:45'),
(9, 5, 5, 'Spring-2025', '2025-07-15 18:08:23');

-- --------------------------------------------------------

--
-- Table structure for table `registration_bundle`
--

CREATE TABLE `registration_bundle` (
  `ID` int(11) NOT NULL,
  `STUDENT_ID` int(11) NOT NULL,
  `SEMESTER` varchar(50) NOT NULL,
  `STATUS` enum('PENDING','PARTIALLY_APPROVED','APPROVED','REJECTED','COMPLETED','CANCELLED') DEFAULT NULL,
  `HOD_APPROVAL` tinyint(1) DEFAULT 0,
  `ADVISOR_APPROVAL` tinyint(1) DEFAULT 0,
  `ACCOUNTS_ADMIN_APPROVAL` tinyint(1) DEFAULT 0,
  `SUBMITTED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `PAYMENT_STATUS` enum('PENDING','PAID','PARTIALLY_PAID','WAIVED') DEFAULT 'PENDING',
  `TOTAL_AMOUNT` decimal(10,2) DEFAULT 0.00,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration_bundle`
--

INSERT INTO `registration_bundle` (`ID`, `STUDENT_ID`, `SEMESTER`, `STATUS`, `HOD_APPROVAL`, `ADVISOR_APPROVAL`, `ACCOUNTS_ADMIN_APPROVAL`, `SUBMITTED_AT`, `PAYMENT_STATUS`, `TOTAL_AMOUNT`, `CREATED_AT`) VALUES
(1, 1, 'Summer-2025', 'COMPLETED', 1, 1, 1, '2025-07-15 07:37:22', 'PAID', 13700.00, '2025-07-15 07:37:22'),
(2, 1, 'Summer-2025', 'COMPLETED', 1, 1, 1, '2025-07-15 08:04:43', 'PAID', 2250.00, '2025-07-15 08:04:43'),
(3, 1, 'Summer-2025', 'COMPLETED', 1, 1, 1, '2025-07-15 13:57:54', 'PAID', 4700.00, '2025-07-15 13:57:54'),
(4, 5, 'Summer-2025', 'COMPLETED', 1, 1, 1, '2025-07-15 17:44:10', 'PAID', 13700.00, '2025-07-15 17:44:10'),
(5, 5, 'Summer-2025', 'REJECTED', 0, 0, 0, '2025-07-15 18:34:23', 'PENDING', 0.00, '2025-07-15 18:34:23'),
(6, 5, 'Summer-2025', 'CANCELLED', 0, 0, 0, '2025-07-15 18:40:00', 'PENDING', 9000.00, '2025-07-15 18:40:00'),
(7, 5, 'Summer-2025', 'CANCELLED', 0, 1, 0, '2025-07-15 19:25:47', 'PENDING', 9000.00, '2025-07-15 19:25:47');

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

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`ID`, `STUDENT_ID`, `COURSE_ID`, `GRADE`, `SEMESTER`, `CREATED_AT`) VALUES
(1, 5, 5, 'A+', 'Spring-2025', '2025-07-15 18:08:23'),
(2, 5, 18, 'F', 'Spring-2023', '2025-07-15 18:36:51');

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
  `SESSION` varchar(15) DEFAULT NULL,
  `MOBILE` varchar(20) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT 0,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`ID`, `REGISTRATION_NUMBER`, `NAME`, `EMAIL`, `PASSWORD`, `DEPARTMENT_ID`, `SESSION`, `MOBILE`, `STATUS`, `CREATED_AT`) VALUES
(1, '0562310005101031', 'Jakaria Chowdhury Tajwone', 'tajwone248tc@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'spring-2025', '01703758327', 1, '2025-05-13 19:48:50'),
(2, '0562310005101003', 'MD Masum Prodhania', 'masum@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 3, 'Spring-2024', '01703758327', 1, '2025-05-13 20:14:04'),
(3, '0562310005101001', 'Amir Hamza', 'amir@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 2, 'Spring-2023', '01873950392', 1, '2025-05-13 20:53:54'),
(4, '0562310005101018', 'mohammed oli', 'oli@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'Spring-2024', '01703758327', 1, '2025-05-16 21:08:31'),
(5, '0562310005101048', 'Chironto Rudro Paul', 'chiru@gmail.com', '$2b$10$alY3bw9vbMoucKv4vuPmvOevHHSUOtYgZ3hEahPwxQjHNsOPcfTUW', 1, 'spring-2024', '01703758347', 1, '2025-05-13 13:48:50');

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
  ADD KEY `fk_registration_bundle_student_id` (`STUDENT_ID`);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `course_cart`
--
ALTER TABLE `course_cart`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `course_registration`
--
ALTER TABLE `course_registration`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `deadlines`
--
ALTER TABLE `deadlines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `prerequisite`
--
ALTER TABLE `prerequisite`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `registered_courses`
--
ALTER TABLE `registered_courses`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `registration_bundle`
--
ALTER TABLE `registration_bundle`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `fk_registration_bundle_student_id` FOREIGN KEY (`STUDENT_ID`) REFERENCES `student` (`ID`);

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
