from flask import Flask, render_template, send_from_directory, jsonify, request, abort
from flask_mysqldb import MySQL
from flask_cors import CORS
import pymysql
import uuid
from database import connection


from functools import wraps

app = Flask(__name__, static_url_path='', static_folder='frontend/public')
CORS(app)
# app.secret_key = os.urandom(24)
# Secret key is used for the security purposes


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'baseDeDonnees'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)


# @app.route('/art/<string:id>/')
# def post(id):
#     cur = mysql.connection.cursor()
#     result = cur.execute("SELECT * FROM posts WHERE id = %s", [id])
#     post = cur.fetchone()
#     return render_template("single_art.html", post=post)


@app.route('/arts', methods=['GET'])
def get_arts():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Execute your SQL query
    cursor.execute('SELECT * FROM produits')

    # Fetch all rows as a list of dictionaries
    arts = cursor.fetchall()

    # Close the connection and cursor
    cursor.close()

    return jsonify(arts)


# @app.route('/dist_artistes', methods=['GET'])
# def get_artistes():
#     cursor = connection.cursor(pymysql.cursors.DictCursor)

#     # Execute your SQL query
#     cursor.execute('SELECT DISTINCT * FROM artistes')

#     # Fetch all rows as a list of dictionaries
#     artistes = cursor.fetchall()

#     # Close the connection and cursor
#     cursor.close()

#     if artistes is None:
#         abort(404)

#     return jsonify(artistes)


# @app.route('/dist_categories', methods=['GET'])
# def get_categories():
#     cursor = connection.cursor(pymysql.cursors.DictCursor)

#     # Execute your SQL query
#     cursor.execute('SELECT DISTINCT nom FROM categories')

#     # Fetch all rows as a list of dictionaries
#     categories = cursor.fetchall()

#     # Close the connection and cursor
#     cursor.close()

#     if categories is None:
#         abort(404)

#     return jsonify(categories)


@app.route('/art/<string:product_id>', methods=['GET'])
def get_product(product_id):
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    cursor.execute('SELECT * FROM produits WHERE id = %s', (product_id,))
    art = cursor.fetchone()

    cursor.close()

    if art is None:
        abort(404)

    return jsonify(art)


@app.route('/clients', methods=['POST'])
def create_new_client():
    data = request.get_json()

    if 'nom' not in data or 'email' not in data or 'mot_de_passe' not in data:
        abort(400, "Les champs 'nom', 'email' et 'mot_de_passe' sont requis.")

    nom = data['nom']
    email = data['email']
    mot_de_passe = data['mot_de_passe']

    client_id = create_client(nom, email, mot_de_passe)

    if client_id is not None:
        return jsonify({"id": client_id, "nom": nom, "email": email}), 201
    else:
        abort(400, "Impossible de créer le client. Vérifiez les données et réessayez.")


def create_client(nom, email, mot_de_passe):
    with connection.cursor() as cursor:
        try:
            client_id = str(uuid.uuid4())
            cursor.execute("INSERT INTO clients(id, nom, email, mot_de_passe) VALUES (%s, %s, %s, %s)",
                           (client_id, nom, email, mot_de_passe))
            connection.commit()
            return client_id
        except pymysql.err.IntegrityError as e:
            if e.args[0] == 1062:  # Code d'erreur pour les entrées en double
                print(
                    f"Erreur: L'email {email} existe déjà. Veuillez utiliser un email unique.")
                return None
            else:
                print("Erreur lors de l'insertion du client:", e)
                return None


if __name__ == '__main__':
    app.run(debug=True,  port=5000)
