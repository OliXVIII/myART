import pymysql
from faker import Faker


fake = Faker()
connection = pymysql.connect(
    host = "localhost",
    user = "root",
    password = "root",
    db = "baseDeDonnees",
    autocommit = True
)

def createRadomArtistes(n):
    artistes = []
    for _ in range(n):
        nom = fake.name()
        nationalite = fake.country()
        anneeDeNaissance = fake.date_of_birth(minimum_age=20, maximum_age=80)
        bibliographie = fake.text()
        artistes.append((nom,nationalite,anneeDeNaissance,bibliographie))
    return artistes

def createArtistsFromTxt(filePath):
    artistes = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                nom, nationalite, description, dateDeNaissance = line.strip().split(';')  # Utilise le séparateur ';'
                artistes.append((nom, nationalite, dateDeNaissance, description))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return artistes
def createCategoriesFromTxt(filePath):
    categories = []
    with open(filePath, "r", encoding="utf-8") as file:
        for line in file:
            if not line.strip():  # Ignore les lignes vides
                continue
            try:
                nom, description = line.strip().split(';')  # Utilise le séparateur ';'
                categories.append((nom, description))
            except ValueError as e:
                print(f"Erreur lors du traitement de la ligne : {line.strip()}")
                print(f"Valeurs extraites : {line.strip().split(';')}")
                print(e)

    return categories

def insertCategories(categories):
    for category in categories:
        nom, description = category
        cursor.execute("INSERT INTO categories(nom, description) VALUES (%s,%s)",(nom, description))



def insertArtistes(artistes):
    for artiste in artistes:
        nom, nationalite, anneeDeNaissance, bibliographie = artiste
        cursor.execute("INSERT INTO artistes(nom,nationalite,anneeDeNaissance,bibliographie,produit_id) VALUES (%s,%s,%s,%s,NULL)",(nom,nationalite,anneeDeNaissance,bibliographie))


def createRandomClients(n):
    clients = []
    for _ in range(n):
        nom = fake.name()
        email = fake.email()
        mot_de_passe =fake.password()
        clients.append((nom,email,mot_de_passe))
    return clients

def insertClients(clients):
    for client in clients:
        nom,email,mot_de_passe = client
        cursor.execute("INSERT INTO clients(nom,email,mot_de_passe) VALUES(%s,%s,%s)",(nom,email,mot_de_passe))

cursor = connection.cursor()

if __name__ == '__main__':
    clients = createRandomClients(0)
    insertClients(clients)
    artistes = createArtistsFromTxt("artiste.txt")
    insertArtistes(artistes)
    categories = createCategoriesFromTxt("categorie.txt")
    insertCategories(categories)
