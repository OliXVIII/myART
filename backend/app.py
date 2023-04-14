from flask import Flask, render_template, send_from_directory, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import pymysql
from database import connection


from functools import wraps

app = Flask(__name__, static_url_path='', static_folder='frontend/public')
CORS(app)
# app.secret_key = os.urandom(24)
# Secret key is used for the security purposes


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Oli$2plate'
app.config['MYSQL_DB'] = 'baseDeDonnees'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)


@app.route("/")
def home():
    return send_from_directory(app.static_folder, 'public/index.html')


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


@app.route('/dist_artistes', methods=['GET'])
def get_artistes():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Execute your SQL query
    cursor.execute('SELECT DISTINCT nom FROM artistes')

    # Fetch all rows as a list of dictionaries
    artistes = cursor.fetchall()

    # Close the connection and cursor
    cursor.close()

    return jsonify(artistes)


@app.route('/dist_categories', methods=['GET'])
def get_categories():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Execute your SQL query
    cursor.execute('SELECT DISTINCT nom FROM categories')

    # Fetch all rows as a list of dictionaries
    categories = cursor.fetchall()

    # Close the connection and cursor
    cursor.close()

    return jsonify(artistes)


@app.route('/art/<string:product_id>', methods=['GET'])
def get_product(product_id):
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    cursor.execute('SELECT * FROM produits WHERE id = %s', (product_id,))
    art = cursor.fetchone()

    cursor.close()

    if art is None:
        abort(404)

    return jsonify(art)


if __name__ == '__main__':
    app.run(debug=True,  port=5000)
