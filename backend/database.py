import pymysql


connection = pymysql.connect(
    host = "localhost",
    user = "root",
    password = "root",
    db = "baseDeDonnees",
    autocommit = True
)

def createArtistsFromTxt(filePath):
    artistes = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                id, nom, nationalite, description, dateDeNaissance = line.strip().split(';')  # Utilise le séparateur ';'
                artistes.append((id, nom, nationalite, dateDeNaissance, description))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
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
                id, nom, description, prix, quantite, categorie_id, image_url, artiste_id = line.strip().split(';')  # Utilise le séparateur ';'
                prix = float(prix)
                quantite = int(quantite)
                produits.append((id, nom, description, prix, quantite, categorie_id, image_url,artiste_id))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return produits

def insertCategories(categories):
    with connection.cursor() as cursor:
        for category in categories:
            id, nom, description = category
            try:
                cursor.execute("INSERT INTO categories(id, nom, description) VALUES (%s, %s, %s)", (id, nom, description))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(f"Erreur: L'ID de la catégorie {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des catégories:", e)

def insertArtistes(artistes):
    with connection.cursor() as cursor:
        for artiste in artistes:
            id, nom, nationalite, anneeDeNaissance, bibliographie = artiste
            try:
                cursor.execute("INSERT INTO artistes(id, nom, nationalite, anneeDeNaissance, bibliographie) VALUES (%s, %s, %s, %s, %s)", (id, nom, nationalite, anneeDeNaissance, bibliographie))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(f"Erreur: L'ID de l'artiste {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des artistes:", e)


def insertProduits(produits):
    with connection.cursor() as cursor:
        for produit in produits:
            id, nom, description, prix, quantite, categorie_id, image_url,artiste_id = produit
            try:
                cursor.execute("INSERT INTO produits(id, nom, description, prix, quantite, categorie_id, image_url,artiste_id) VALUES (%s, %s, %s, %s, %s, %s, %s,%s)", (id, nom, description, prix, quantite, categorie_id, image_url,artiste_id))
                connection.commit()
            except pymysql.err.IntegrityError as e:
                if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                    print(f"Erreur: L'ID du produit {nom} existe déjà. Veuillez utiliser un ID unique.")
                else:
                    print("Erreur lors de l'insertion des produits:", e)

cursor = connection.cursor()

if __name__ == '__main__':
    artistes = createArtistsFromTxt("backend/artisteId.txt")
    insertArtistes(artistes)
    categories = createCategoriesFromTxt("backend/categorieId.txt")
    insertCategories(categories)
    produits = createProduitsFromTxt("backend/produitId.txt")
    insertProduits(produits)
