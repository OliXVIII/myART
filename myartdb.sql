-- phpMyAdmin SQL Dump
-- version 4.8.3
--
-- Host: localhost:3306
-- Generation Time: Apr 26, 2020 at 08:12 PM
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
-- Database: `myartdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `arts`
--

DROP TABLE IF EXISTS `arts`;
CREATE TABLE IF NOT EXISTS `arts` (
  `body` text,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(100) DEFAULT NULL,
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `price` varchar(100) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `arts`
--

INSERT INTO `arts` (`body`, `create_date`, `description`, `id`, `price`, `title`) VALUES
('body', NULL, 'description', 1, '69', 'Title') ,
('body', NULL, 'description', 2, '69', 'Title') ,
('body', NULL, 'description', 3, '69', 'Title') ,
('body', NULL, 'description', 4, '69', 'Title'),
('body', NULL, 'description', 5, '69', 'Title'),
('body', NULL, 'description', 6, '69', 'Title'),
('body', NULL, 'description', 7, '69', 'Title'),
('body', NULL, 'description', 8, '69', 'Title');

-- -------------------------------------------------------