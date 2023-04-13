from flask import Flask, jsonify
import pymysql.cursors
import json
import sqlite3

app = Flask(__name__)
import pymysql

# Connectez-vous à la base de données
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='mariowii',
    db='baseDeDonnees',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

categories = []
artistes = []

try:
    with connection.cursor() as cursor:
        # Sélectionnez tous les types d'oeuvres d'art dans la colonne "categorieId"
        sql = "SELECT DISTINCT categorieId FROM nomDeLaTable;"
        cursor.execute(sql)
        result = cursor.fetchall()
        for row in result:
            categories.append(row['categorieId'])
            
        # Sélectionnez tous les artistes dans la colonne "artisteID"
        sql = "SELECT DISTINCT artisteID FROM nomDeLaTable;"
        cursor.execute(sql)
        result = cursor.fetchall()
        for row in result:
            artistes.append(row['artisteID'])
finally:
    # Fermez la connexion à la base de données
    connection.close()