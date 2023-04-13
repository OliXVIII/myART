from flask import Flask, jsonify
import pymysql.cursors
import json
import sqlite3

app = Flask(__name__)

# Connexion à la base de données MySQL
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='mariowii',
    db='baseDeDonnees',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# Point de terminaison pour récupérer les données pour les artistes et les oeuvres d'art


@app.route("/get_artists_and_artworks")
def get_artists_and_artworks():
    try:
        # Connect to the database
        conn = sqlite3.connect('art_database.db')
        c = conn.cursor()

        # Read the artiste.txt file
        with open('artiste.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Extract the artist's name and art style from the database and print them to the console
        for line in lines:
            artist_name = line.split(';')[0]
            c.execute("SELECT art_style FROM artists WHERE name=?",
                      (artist_name,))
            art_style = c.fetchone()[0]
            print(f"{artist_name} - {art_style}")

    finally:
        connection.close()
