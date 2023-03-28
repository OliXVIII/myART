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
                id, nom, description, prix, quantite, categorie_id, image_url = line.strip().split(';')  # Utilise le séparateur ';'
                prix = float(prix)
                quantite = int(quantite)
                produits.append((id, nom, description, prix, quantite, categorie_id, image_url))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return produits


def insertCategories(categories):
    for category in categories:
        id, nom, description = category
        cursor.execute("INSERT INTO categories(id, nom, description) VALUES (%s, %s, %s)", (id, nom, description))

def insertArtistes(artistes):
    for artiste in artistes:
        id, nom, nationalite, anneeDeNaissance, bibliographie = artiste
        print(f"Inserting: {id}, {nom}, {nationalite}, {anneeDeNaissance}, {bibliographie}")
        cursor.execute("INSERT INTO artistes(id, nom, nationalite, anneeDeNaissance, bibliographie, produit_id) VALUES (%s, %s, %s, %s, %s, DEFAULT)", (id, nom, nationalite, anneeDeNaissance, bibliographie))

def insertProduits(produits):
    for produit in produits:
        id, nom, description, prix, quantite, categorie_id, image_url = produit
        print(f"Inserting: {id}, {nom}, {description}, {prix}, {quantite}, {categorie_id}, {image_url}")
        cursor.execute("INSERT INTO produits(id, nom, description, prix, quantite, categorie_id, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s)", (id, nom, description, prix, quantite, categorie_id, image_url))


cursor = connection.cursor()

if __name__ == '__main__':
    #artistes = createArtistsFromTxt("artisteId.txt")
    #insertArtistes(artistes)
    #categories = createCategoriesFromTxt("categorieId.txt")
    #insertCategories(categories)
    produits = createProduitsFromTxt("produitId.txt")
    insertProduits(produits)
