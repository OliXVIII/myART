from flask import Flask, render_template, send_from_directory
from flask_mysqldb import MySQL
# from passlib.hash import sha256_crypt


from functools import wraps
import os

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
# app.secret_key = os.urandom(24)
# Secret key is used for the security purposes


app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'new-password'
app.config['MYSQL_DB'] = 'myartdb'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


# @app.route('/art/<string:id>/')
# def post(id):
#     cur = mysql.connection.cursor()
#     result = cur.execute("SELECT * FROM posts WHERE id = %s", [id])
#     post = cur.fetchone()
#     return render_template("single_art.html", post=post)


@app.route('/arts', methods=['GET', 'POST'])
def posts():
    cur = mysql.connection.cursor()
    result = cur.execute("SELECT * FROM posts")
    posts = cur.fetchall()
    if result > 0:
        cur.close()
        return render_template('posts.html', posts=posts)
    else:
        msg = 'No posts found'
        cur.close()
        return render_template('multiple_arts.html', msg=msg)


if __name__ == '__main__':
    app.run(debug=True)
