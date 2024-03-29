SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "-05:00";
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
DROP DATABASE IF EXISTS baseDeDonnees;
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
    id VARCHAR(36) PRIMARY KEY,
    pays VARCHAR(100) NOT NULL,
    code_postale VARCHAR(10) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    rue VARCHAR(255) NOT NULL,
    numero_porte INT
);
CREATE TABLE IF NOT EXISTS clients (
    id varchar(36) PRIMARY KEY,
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
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS artistes(
    id VARCHAR(36) PRIMARY KEY ,
    nom VARCHAR(255) NOT NULL,
    nationalite VARCHAR(100) NOT NULL,
    anneeDeNaissance DATE,
    bibliographie text,
    url_img varchar(255),
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
    id VARCHAR(36) PRIMARY KEY,
    client_id varchar(36),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS commandes (
    id VARCHAR(36) PRIMARY KEY ,
    client_id varchar(36),
    adresse_id VARCHAR(36),
    date_commande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente', 'En cours', 'Expédié', 'Livré', 'Annulé') NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (adresse_id) REFERENCES adresses(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS paiements(
    id VARCHAR(36) PRIMARY KEY,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('argent','crédit','débit','autre'),
    montant DECIMAL(10, 2) NOT NULL,
    statut ENUM('En cours','Complété','Échec'),
    commande_id VARCHAR(36),
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS lignePanier(
    id INT PRIMARY KEY AUTO_INCREMENT,
    quantite INT,
    id_panier VARCHAR(36) NOT NULL,
    id_produit VARCHAR(36) NOT NULL,
    FOREIGN KEY(id_panier) REFERENCES paniers(id) ON DELETE CASCADE,
    FOREIGN KEY(id_produit) REFERENCES produits(id) ON DELETE CASCADE
);
/*
CREATE TABLE IF NOT EXISTS comptes(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_client varchar(36) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES clients(id) ON DELETE CASCADE
);*/

DELIMITER //
CREATE TRIGGER check_unique_id_artistes
BEFORE INSERT ON artistes
FOR EACH ROW
BEGIN
    IF EXISTS(SELECT * FROM artistes WHERE id = NEW.id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cet ID est déjà utilisé pour un autre artiste';
    end IF;
end; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_unique_nom_artistes
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
SELECT * FROM clients;
SELECT * FROM commandes;
SELECT * FROM adresses;
SELECT * FROM paniers;
SELECT * FROM administrateurs;

CREATE UNIQUE INDEX idx_artistes_id ON artistes(id) USING BTREE;
CREATE UNIQUE INDEX idx_produits_id ON produits(id) USING BTREE;
CREATE INDEX idx_produits_categorie_id ON produits(categorie_id) USING BTREE;
CREATE INDEX idx_produits_artistes_id ON produits(artiste_id) USING BTREE;
CREATE UNIQUE INDEX idx_clients_email ON clients(email) USING BTREE;

SELECT * FROM produits WHERE artiste_id = (SELECT id FROM artistes WHERE nom LIKE '%Van Gogh%');