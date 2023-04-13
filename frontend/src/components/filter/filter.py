import pymysql
from flask import Flask, jsonify
import pymysql.cursors
import json
import sqlite3

app = Flask(__name__)

# Connectez-vous à la base de données
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='mariowii',
    db='baseDeDonnees',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# Récupération des catégories et des artistes
def get_categories():
    categories = []
    try:
        with connection.cursor() as cursor:
            sql = "SELECT DISTINCT categorieId FROM nomDeLaTable;"
            cursor.execute(sql)
            result = cursor.fetchall()
            for row in result:
                categories.append(row['categorieId'])
    finally:
        connection.close()
    return categories

def get_artistes():
    artistes = []
    try:
        with connection.cursor() as cursor:
            sql = "SELECT DISTINCT artisteID FROM nomDeLaTable;"
            cursor.execute(sql)
            result = cursor.fetchall()
            for row in result:
                artistes.append(row['artisteID'])
    finally:
        connection.close()
    return artistes


__all__ = ['get_categories', 'get_artistes']