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
-- Table structure for table `account_tb`
--

DROP TABLE IF EXISTS `account_tb`;
CREATE TABLE IF NOT EXISTS `account_tb` (
  `account_id` int(11) NOT NULL AUTO_INCREMENT,
  `account_balance` decimal(65,0) DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `account_id` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10124 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account_tb`
--

INSERT INTO `account_tb` (`account_id`, `account_balance`, `timestamp`) VALUES
(1018, '4400', '2020-02-21 01:37:42'),
(10117, '4400', '2020-02-21 01:36:35'),
(10123, '3576', '2020-02-21 01:58:42');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
