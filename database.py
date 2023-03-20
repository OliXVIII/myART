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
        nom,email,mot_de_passe =client
        cursor.execute("INSERT INTO clients(nom,email,mot_de_passe) VALUES(%s,%s,%s)",(nom,email,mot_de_passe))

cursor = connection.cursor()

if __name__ == '__main__':
    clients = createRandomClients(1000)
    insertClients(clients)

