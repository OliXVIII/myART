SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "-05:00";

CREATE DATABASE IF NOT EXISTS baseDeDonnees;
USE baseDeDonnees;
DROP TABLE IF EXISTS lignePanier;
DROP TABLE IF EXISTS paiements;
DROP TABLE IF EXISTS produits;
DROP TABLE IF EXISTS artistes;
DROP TABLE IF EXISTS commandes;
DROP TABLE IF EXISTS paniers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS administrateurs;
DROP TABLE IF EXISTS comptes;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS adresses;


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
  id varchar(36) PRIMARY KEY,
  nom VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS administrateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS artistes(
    id VARCHAR(36) PRIMARY KEY ,
    nom VARCHAR(255) NOT NULL,
    nationalite VARCHAR(255) NOT NULL,
    anneeDeNaissance DATE,
    bibliographie text,
    UNIQUE (id),
    UNIQUE (nom)
);
CREATE TABLE IF NOT EXISTS produits (
    id varchar(36) PRIMARY KEY ,
    nom varchar(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    quantite INT NOT NULL,
    categorie_id varchar(36),
    image_url VARCHAR(255),
    artiste_id VARCHAR(36),
    UNIQUE(id),
    UNIQUE (nom),
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (artiste_id) REFERENCES artistes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paniers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
/*Si on supprime un clients on supprime tous les commandes quil a fait*/
CREATE TABLE IF NOT EXISTS commandes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    adresse_id INT,
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente', 'En cours', 'Expédié', 'Livré', 'Annulé') NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (adresse_id) REFERENCES adresses(id) ON DELETE SET NULL
);



CREATE TABLE IF NOT EXISTS paiements(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('argent','crédit','débit','autre'),
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('En cours','Complété','Échec'),
    commande_id INT,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lignePanier(
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantite INT,
    id_panier INT NOT NULL,
    id_produit VARCHAR(36) NOT NULL,
    FOREIGN KEY(id_panier) REFERENCES paniers(id) ON DELETE CASCADE,
    FOREIGN KEY(id_produit) REFERENCES produits(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comptes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_client INT NOT NULL,
    FOREIGN KEY(id_client) REFERENCES clients(id) ON DELETE CASCADE
);


DELIMITER //
CREATE TRIGGER chechUniqueId
BEFORE INSERT ON artistes
FOR EACH ROW
BEGIN
    IF EXISTS(SELECT * FROM artistes WHERE id = NEW.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cet id est déjà utilisé pour un autre artiste';
    end IF;
end; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_unique_nom
BEFORE INSERT ON artistes
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT * FROM artistes WHERE nom = NEW.nom) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nom déjà présent pour un autre artiste.';
    END IF;
END;
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE rechercher_produits(IN mot_recherche VARCHAR(255))
BEGIN
  SELECT *
  FROM produits
  WHERE nom LIKE CONCAT('%', mot_recherche, '%')
  OR artiste_id IN (SELECT id FROM artistes WHERE nom LIKE CONCAT('%', mot_recherche, '%'));
END;
//
DELIMITER ;




SHOW TABLES;
SELECT * FROM clients;
SELECT * FROM artistes;
SELECT * FROM produits;
SELECT * FROM categories;

/*Index sur les objets dart fait par les artistes*/
CREATE INDEX idx_artistes_nom ON artistes(nom);

SELECT * FROM produits WHERE artiste_id = (SELECT id FROM artistes WHERE nom LIKE '%Van Gogh%');
CALL rechercher_produits('casso');



