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
    artistes = createRadomArtistes(100)
    insertArtistes(artistes)
