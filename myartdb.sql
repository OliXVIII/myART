-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
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
-- Database: `personalblog`
--CREATE DATABASE IF NOT EXISTS baseDeDonnees;
USE baseDeDonnees;


-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `arts`;
CREATE TABLE IF NOT EXISTS `arts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `body` text,
  `create_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);
CREATE TABLE IF NOT EXISTS administrateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS produits (
    id int PRIMARY KEY AUTO_INCREMENT,
    nom varchar(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    quantite INT NOT NULL,
    categorie_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);
CREATE TABLE IF NOT EXISTS paniers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS commandes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente', 'En cours', 'Expédié', 'Livré', 'Annulé') NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);
--
-- Dumping data for table `posts`
--

-- -------------------------------------------------------

INSERT INTO clients (nom, email, mot_de_passe) VALUES("Jean-Christophe Parent","jcpar27@ulaval.ca","salut11");
SELECT * FROM clients;

INSERT INTO categories (nom, description) VALUES("tableau","petite description");
SELECT * FROM categories;

SHOW TABLES;

SELECT * FROM clients;


