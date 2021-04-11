-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 11, 2021 at 12:31 AM
-- Server version: 5.7.33
-- PHP Version: 7.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `henryliu_termproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `apikey`
--

CREATE TABLE `apikey` (
  `apikey_id` int(11) NOT NULL,
  `apikey` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `apikey`
--

INSERT INTO `apikey` (`apikey_id`, `apikey`) VALUES
(1, 'MyAppKey');

-- --------------------------------------------------------

--
-- Table structure for table `Booking`
--

CREATE TABLE `Booking` (
  `b_id` int(11) NOT NULL,
  `booking_date` varchar(20) DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Booking`
--

INSERT INTO `Booking` (`b_id`, `booking_date`, `venue_id`, `c_id`) VALUES
(1, '2021-04-10', 1, 1),
(4, '2020-01-01', 2, 2),
(17, '2021-05-01', 1, 1),
(18, '2021-05-02', 1, 1),
(19, '2021-05-03', 1, 1),
(21, '2021-05-04', 1, 1),
(22, '2021-05-04', 2, 1),
(23, '2021-04-10', 4, 1),
(24, '2021-04-14', 1, 1),
(25, '2021-04-09', 9, 1),
(26, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Customer`
--

CREATE TABLE `Customer` (
  `c_id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Customer`
--

INSERT INTO `Customer` (`c_id`, `fname`, `lname`, `email`) VALUES
(1, 'Customer1', 'BadCustomer', 'bc@bad.com2'),
(2, 'Customer2', 'GoodCust', 'gc@goodl.com2'),
(39, 'aef', 'aesfa', 'sefsf@ae.gegw'),
(41, 'ag', 'ag', 'fifia@fifa.coa'),
(42, 'Henry', 'Liu', 'Henry@BCIT.ca'),
(43, 'abc', 'def', 'abc@def.coms');

-- --------------------------------------------------------

--
-- Table structure for table `Statistics`
--

CREATE TABLE `Statistics` (
  `id` int(11) NOT NULL,
  `method` varchar(10) DEFAULT NULL,
  `endpoint` varchar(100) DEFAULT NULL,
  `requests` int(100) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Statistics`
--

INSERT INTO `Statistics` (`id`, `method`, `endpoint`, `requests`) VALUES
(1, 'GET', '/API/v1/customers/', 292),
(2, 'PUT', '/API/v1/customers/', 16),
(3, 'POST', '/API/v1/customers/', 47),
(4, 'DELETE', '/API/v1/customers/', 34),
(5, 'GET', '/API/v1/venues/', 123),
(6, 'POST', '/API/v1/venues/', 7),
(7, 'PUT', '/API/v1/venues/', 4),
(8, 'DELETE', '/API/v1/venues/', 3),
(9, 'GET', '/API/v1/bookings/', 93),
(10, 'POST', '/API/v1/bookings/', 21),
(11, 'DELETE', '/API/v1/bookings/', 9);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(11) NOT NULL,
  `username` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `username`, `password`) VALUES
(1, 'amir', '$2b$10$cckXR/reS4ZuS1540QenS.y6/OBOvPCogqAdb6ggkw9IZ2KldELsW');

-- --------------------------------------------------------

--
-- Table structure for table `Venue`
--

CREATE TABLE `Venue` (
  `venue_id` int(11) NOT NULL,
  `venue_name` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Venue`
--

INSERT INTO `Venue` (`venue_id`, `venue_name`, `address`) VALUES
(1, 'Happy Place', '1234 Sweet Home'),
(2, 'Vegas Best Wedding Venue', '122 Wedding Drive'),
(4, 'fallout', 'New Vegas'),
(5, 'Vegas Wedding Chapel', '320 S 3rd Sts'),
(8, 'Vegas Vegas', 'Bellagio Hotel'),
(9, 'vega', 'vega vega vega7700'),
(11, 'Little Chapel', 'Nevada Desert');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apikey`
--
ALTER TABLE `apikey`
  ADD PRIMARY KEY (`apikey_id`);

--
-- Indexes for table `Booking`
--
ALTER TABLE `Booking`
  ADD PRIMARY KEY (`b_id`),
  ADD KEY `venue_id` (`venue_id`),
  ADD KEY `c_id` (`c_id`);

--
-- Indexes for table `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `Statistics`
--
ALTER TABLE `Statistics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `Venue`
--
ALTER TABLE `Venue`
  ADD PRIMARY KEY (`venue_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `apikey`
--
ALTER TABLE `apikey`
  MODIFY `apikey_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Booking`
--
ALTER TABLE `Booking`
  MODIFY `b_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `Customer`
--
ALTER TABLE `Customer`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `Statistics`
--
ALTER TABLE `Statistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Venue`
--
ALTER TABLE `Venue`
  MODIFY `venue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Booking`
--
ALTER TABLE `Booking`
  ADD CONSTRAINT `Booking_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `Customer` (`c_id`),
  ADD CONSTRAINT `Booking_ibfk_2` FOREIGN KEY (`venue_id`) REFERENCES `Venue` (`venue_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
