-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 21, 2020 at 04:22 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cahtbot_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer_tb`
--

DROP TABLE IF EXISTS `customer_tb`;
CREATE TABLE IF NOT EXISTS `customer_tb` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) DEFAULT NULL,
  `mname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(200) NOT NULL,
  UNIQUE KEY `id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10124 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_tb`
--

INSERT INTO `customer_tb` (`account_id`, `fname`, `mname`, `lname`, `dob`, `mobile`, `email`, `password`, `address`, `image`) VALUES
(10117, 'Ade', 'Kamoru', 'Ajasa', '0023-03-22', '23', 'qwdq@ds.sd', 'h6so', '232', ''),
(10118, 'Adeleke', 'SOlayemi', 'Dabiri', '0023-03-22', '23', 'qwdq@ds.s', '6ahk', '232', ''),
(10123, 'Habeeb', 'Adewale', 'Mustapha', '0001-11-11', '1234', 'ade@wa.com', '1kbi', 'Arodandy house, Akobo Ibadan', 'baby.jpg');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
