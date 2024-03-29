import hashlib
import uuid

import pymysql

connection = pymysql.connect(
    host="localhost",
    user="root",
    password="root",
    db="baseDeDonnees",
    autocommit=True
)


def createArtistsFromTxt(filePath):
    artistes = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                id, nom, nationalite, description, dateDeNaissance, url_img = line.strip().split(
                    ';')  # Utilise le séparateur ';'
                artistes.append(
                    (id, nom, nationalite, dateDeNaissance, description, url_img))
            except ValueError as e:
                print(
                    f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return artistes


def createCategoriesFromTxt(filePath):
    categories = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():   # Ignore les lignes vides
                continue
            try:
                id, nom, description = line.strip().split(';')   # Utilise le séparateur ';'
                categories.append((id, nom, description))
            except ValueError as e:
                print(f"Error processing line: {line.strip()}")
                print(f"Extracted values: {line.strip().split(';')}")
                print(e)

    return categories


def createProduitsFromTxt(filePath):
    produits = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                id, nom, description, prix, quantite, categorie_id, image_url, artiste_id = line.strip(
                ).split(';')  # Utilise le séparateur ';'
                prix = float(prix)
                quantite = int(quantite)
                produits.append((id, nom, description, prix,
                                quantite, categorie_id, image_url, artiste_id))
            except ValueError as e:
                print(
                    f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return produits


def insertCategories(categories):
    with connection.cursor() as cursor:
        for category in categories:
            id, nom, description = category
            try:
                cursor.execute(
                    "INSERT INTO categories(id, nom, description) VALUES (%s, %s, %s)", (id, nom, description))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(
                        f"Erreur: L'ID de la catégorie {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des catégories:", e)


def artiste_exists(id):
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM artistes WHERE id = %s", (id,))
        result = cursor.fetchone()
        return result[0] > 0

def insertArtistes(artistes):
    with connection.cursor() as cursor:
        for artiste in artistes:
            id, nom, nationalite, anneeDeNaissance, bibliographie, url_img = artiste
            if artiste_exists(id):
                print(
                    f"Erreur: L'ID de l'artiste {nom} existe déjà. Veuillez utiliser un ID unique.")
                continue  # Continue avec le prochain artiste

            try:
                cursor.execute("INSERT INTO artistes(id, nom, nationalite, anneeDeNaissance, bibliographie,url_img) VALUES (%s, %s, %s, %s, %s, %s)", (
                    id, nom, nationalite, anneeDeNaissance, bibliographie, url_img))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(
                        f"Erreur: L'ID de l'artiste {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des artistes:", e)


def insertProduits(produits):
    with connection.cursor() as cursor:
        for produit in produits:
            id, nom, description, prix, quantite, categorie_id, image_url, artiste_id = produit
            try:
                cursor.execute("INSERT INTO produits(id, nom, description, prix, quantite, categorie_id, image_url,artiste_id) VALUES (%s, %s, %s, %s, %s, %s, %s,%s)", (
                    id, nom, description, prix, quantite, categorie_id, image_url, artiste_id))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(
                        f"Erreur: L'ID du produit {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des produits:", e)


def insertClient(id, nom, email, mot_de_passe):
    with connection.cursor() as cursor:
        try:
            cursor.execute("INSERT INTO clients(id, nom, email, mot_de_passe) VALUES (%s, %s, %s, %s)",
                           (id, nom, email, mot_de_passe))
            connection.commit()
        except pymysql.err.IntegrityError as e:
            if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                print(
                    f"Erreur: L'email {email} existe déjà. Veuillez utiliser un email unique.")
            else:
                print("Erreur lors de l'insertion du client:", e)

def insertAdminsFromTxt(filePath):
    admins = []

    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                id, username, password, email = line.strip().split(';')  # Utilise le séparateur ';'
                hashed_password = hashlib.sha256(password.encode()).hexdigest()
                admins.append((id, username, hashed_password, email))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    with connection.cursor() as cursor:
        for admin in admins:
            id, username, hashed_password, email = admin
            try:
                cursor.execute("INSERT INTO administrateurs(id, nom, mot_de_passe, email) VALUES (%s, %s, %s, %s)",
                               (id, username, hashed_password, email))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(
                        f"Erreur: L'ID de l'administrateur {username} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des administrateurs:", e)




cursor = connection.cursor()

if __name__ == '__main__':
    categories = createCategoriesFromTxt("./categorieId.txt")
    insertCategories(categories)
    artistes = createArtistsFromTxt("./artisteId.txt")
    insertArtistes(artistes)
    produits = createProduitsFromTxt("./produitId.txt")
    insertProduits(produits)
    insertClient(uuid.uuid4(), "Jean-Christophe Parent","jean-christophep@live.fr", "lapin123")
    insertAdminsFromTxt("./admin.txt")
