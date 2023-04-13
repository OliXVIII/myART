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
app.config['MYSQL_PASSWORD'] = 'root'
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


@app.route('/artistes', methods=['GET'])
def get_artists():
    cursor = connection.cursor(pymysql.cursors.DictCursor)

    # Execute your SQL query
    cursor.execute('SELECT * FROM artistes')

    # Fetch all rows as a list of dictionaries
    artistes = cursor.fetchall()

    # Close the connection and cursor
    cursor.close()

    return jsonify(artistes)


if __name__ == '__main__':
    app.run(debug=True,  port=5000)
