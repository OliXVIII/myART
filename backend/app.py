import hashlib

from flask import Flask, render_template, send_from_directory, jsonify, request, abort
from flask_mysqldb import MySQL
from flask_cors import CORS
import pymysql
import uuid
from database import connection


from functools import wraps

app = Flask(__name__, static_url_path='', static_folder='frontend/public')
CORS(app, resources={r'*': {'origins': '*'}})
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


@app.route('/arts', methods=['GET', 'DELETE'])
def arts():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    if request.method == 'GET':
        categorie_id = request.args.get('categorie_id', None)
        query = 'SELECT p.*, c.nom, a.nom FROM produits p JOIN categories c ON p.categorie_id = c.id JOIN artistes a ON p.artiste_id = a.id '

        try:
            if categorie_id:
                query += ' WHERE categorie_id = %s '

                cursor.execute(query, (categorie_id,))
            else:
                cursor.execute(query)
            arts = cursor.fetchall()
            cursor.execute('SELECT * FROM categories')
            categories = cursor.fetchall()
            cursor.close()
        except Exception as e:
            cursor.close()
            abort(500, description=str(e))

        if arts is None:
            abort(404)

        return jsonify({"arts": arts, "categories": categories})

    elif request.method == 'DELETE':
        productIds = request.get_json()
        print(productIds)

        if not productIds:
            return jsonify({"error": "No product IDs provided"}), 400

        query = f'DELETE FROM produits WHERE id IN ({", ".join(["%s"] * len(productIds))})'
        affected_rows = cursor.execute(query, productIds)
        connection.commit()
        cursor.close()

        return jsonify({"affectedRows": affected_rows}), 202


@app.route('/art/<string:product_id>', methods=['GET'])
def get_product(product_id):
    include_category = request.args.get('includeCategory', None) == 'true'

    cursor = connection.cursor(pymysql.cursors.DictCursor)
# 'SELECT p.*, c.nom, a.nom FROM produits p JOIN categories c ON p.categorie_id = c.id JOIN artistes a ON p.artiste_id = a.id
    if include_category:
        query = """
        SELECT produits.*, categories.nom as categorie_nom, categories.description as categorie_description, a.nom
        FROM produits
        JOIN artistes a ON produits.artiste_id = a.id
        LEFT JOIN categories ON produits.categorie_id = categories.id
        WHERE produits.id = %s
        """
    else:
        query = 'SELECT * FROM produits WHERE id = %s'

    cursor.execute(query, (product_id,))
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
    mot_de_passe_crypte = hashlib.sha256(
        mot_de_passe.encode('utf-8')).hexdigest()
    client_id = create_client(nom, email, mot_de_passe_crypte)

    if client_id is not True or client_id is not False:
        return jsonify({"id": client_id, "nom": nom, "email": email}), 201
    else:
        if client_id:
            abort(400, "L'email existe déjà.")
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
            if e.args[0] == 1062:
                print(
                    f"L'email {email} existe déjà.")
                return True
            else:
                print("Erreur lors de l'insertion du client:", e)
                return None


@app.route('/artist/<string:artist_id>', methods=['GET'])
def get_artist(artist_id):
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT a.*, p.nom, p.image_url, p.id
        FROM artistes a
        LEFT JOIN produits p ON a.id = p.artiste_id
        WHERE a.id = %s;
        """, (artist_id,))
    artist = cursor.fetchall()

    cursor.close()

    if artist is None:
        abort(404)

    return jsonify(artist)


@app.route('/artists', methods=['GET'])
def get_artists():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    cursor.execute("""
        SELECT artistes.id, artistes.nom, COUNT(produits.id) AS nb_produits
        FROM artistes USE INDEX (idx_artiste_id)
        LEFT JOIN produits
        ON artistes.id = produits.artiste_id
        GROUP BY artistes.id;""")

    artists = cursor.fetchall()
    cursor.close()

    return jsonify(artists)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if 'email' not in data or 'mot_de_passe' not in data:
        abort(400, "Les champs 'email' et 'mot_de_passe' sont requis.")

    email = data['email']
    mot_de_passe = data['mot_de_passe']
    mot_de_passe_crypte = hashlib.sha256(
        mot_de_passe.encode('utf-8')).hexdigest()

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM clients USE INDEX (idx_clients_mdp) WHERE email = %s AND mot_de_passe = %s", (email, mot_de_passe_crypte))
    client = cursor.fetchone()

    if client is None:
        abort(400, "Email ou mot de passe incorrect.")

    return jsonify(client)


@app.route('/adresses', methods=['POST'])
def create_adresse():
    id = str(uuid.uuid4())
    data = request.get_json()

    if 'pays' not in data or 'code_postale' not in data or 'ville' not in data or 'rue' not in data:
        abort(400, "Les champs 'pays', 'code_postale', 'ville' et 'rue' sont requis.")

    pays = data['pays']
    code_postale = data['code_postale']
    ville = data['ville']
    rue = data['rue']
    numero_porte = data.get('numero_porte', None)

    adresse_id = create_adresse_db(
        id, pays, code_postale, ville, rue, numero_porte)

    if adresse_id is not None:
        return jsonify({"id": adresse_id, "pays": pays, "code_postale": code_postale, "ville": ville, "rue": rue, "numero_porte": numero_porte}), 201
    else:
        abort(400, "Impossible de créer l'adresse. Vérifiez les données et réessayez.")


def create_adresse_db(id, pays, code_postale, ville, rue, numero_porte):
    with connection.cursor() as cursor:
        try:
            cursor.execute("INSERT INTO adresses(id,pays, code_postale, ville, rue, numero_porte) VALUES (%s,%s, %s, %s, %s, %s)",
                           (id, pays, code_postale, ville, rue, numero_porte))
            connection.commit()
            adresse_id = cursor.lastrowid
            return adresse_id
        except Exception as e:
            print("Erreur lors de l'insertion de l'adresse:", e)
            return None


@app.route('/commandes', methods=['POST'])
def create_commande():
    data = request.get_json()
    print("Données reçues :", data)

    if 'client_id' not in data or 'statut' not in data:
        abort(400, "Les champs 'client_id' et 'statut' sont requis.")

    client_id = data['client_id']
    adresse_id = data.get('adresse_id', None)
    statut = data['statut']

    commande_id = create_commande_db(client_id, adresse_id, statut)

    if commande_id is not None:
        return jsonify({"id": commande_id, "client_id": client_id, "adresse_id": adresse_id, "statut": statut}), 201
    else:
        abort(
            400, "Impossible de créer la commande. Vérifiez les données et réessayez.")


def create_commande_db(client_id, adresse_id, statut):
    with connection.cursor() as cursor:
        try:
            id = str(uuid.uuid4())
            cursor.execute("INSERT INTO commandes(id, client_id, adresse_id, statut) VALUES (%s, %s, %s, %s)", 
                           (id, client_id, adresse_id, statut))
            connection.commit()
            return id
        except Exception as e:
            print("Erreur lors de l'insertion de la commande:", e)
            return None


@app.route('/adresses/search', methods=['GET'])
def search_adresses():
    query = request.args.get('query', None)

    if not query:
        return jsonify({"error": "Aucune requête de recherche fournie"}), 400

    cursor = connection.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("""
            SELECT *
            FROM adresses
            WHERE pays LIKE %s OR code_postale LIKE %s OR ville LIKE %s OR rue LIKE %s
            """, (f'%{query}%', f'%{query}%', f'%{query}%', f'%{query}%'))
        adresses = cursor.fetchall()
    except Exception as e:
        cursor.close()
        abort(500, description=str(e))

    if not adresses:
        return jsonify({"error": "Aucune adresse trouvée pour cette recherche"}), 404

    return jsonify(adresses)


if __name__ == '__main__':
    app.run(debug=True,  port=5000)
