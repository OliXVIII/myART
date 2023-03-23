SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "-05:00";

CREATE DATABASE IF NOT EXISTS baseDeDonnees;
USE baseDeDonnees;

CREATE TABLE IF NOT EXISTS adresses(
    id INT PRIMARY KEY AUTO_INCREMENT,
    pays VARCHAR(255) NOT NULL,
    code_postale VARCHAR(10) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    rue VARCHAR(255) NOT NULL,
    numero_porte INT
);

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
    adresse_id INT,
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente', 'En cours', 'Expédié', 'Livré', 'Annulé') NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (adresse_id) REFERENCES adresses(id)
);

CREATE TABLE IF NOT EXISTS artistes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    nationalite VARCHAR(255) NOT NULL,
    anneeDeNaissance DATE,
    bibliographie text,
    produit_id INT,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

CREATE TABLE IF NOT EXISTS paiements(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('argent','crédit','débit','autre'),
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('En cours','Complété','Échec'),
    commande_id INT,
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);

CREATE TABLE IF NOT EXISTS lignePanier(
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantite INT,
    id_panier INT NOT NULL,
    id_produit INT NOT NULL,
    FOREIGN KEY(id_panier) REFERENCES paniers(id),
    FOREIGN KEY(id_produit) REFERENCES produits(id)
);

CREATE TABLE IF NOT EXISTS comptes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_client INT NOT NULL,
    FOREIGN KEY(id_client) REFERENCES clients(id)
);

INSERT INTO clients (nom, email, mot_de_passe) VALUES("Jean-Christophe Parent","jcpar27@ulaval.ca","salut11");
SELECT * FROM clients;

INSERT INTO categories (nom, description) VALUES("tableau","petite description");
SELECT * FROM categories;

SHOW TABLES;

SELECT * FROM clients;
SELECT * FROM artistes;


