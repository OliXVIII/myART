import pymysql

connection = pymysql.connect(
    host = "localhost",
    user = "root",
    password = "root",
    db = "baseDeDonnees",
    autocommit = True
)

cursor = connection.cursor()

if __name__ == '__main__':


