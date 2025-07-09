-- Table structure for table `verification`
CREATE TABLE `verification` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(100) NOT NULL,
  `TYPE` enum('PASSWORD_RESET', 'EMAIL_VERIFICATION') NOT NULL,
  `OTP` varchar(6) NOT NULL,
  `EXPIRES_AT` timestamp NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `IS_USED` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`ID`),
  KEY `EMAIL` (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
