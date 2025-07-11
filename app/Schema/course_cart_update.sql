-- Add proper structure to course_cart table
ALTER TABLE `course_cart` ADD `USER_ID` int(11) NOT NULL;
ALTER TABLE `course_cart` ADD `COURSE_ID` int(11) NOT NULL;
ALTER TABLE `course_cart` ADD `STATUS` tinyint(1) DEFAULT 0;
ALTER TABLE `course_cart` ADD PRIMARY KEY (`ID`);
ALTER TABLE `course_cart` MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
