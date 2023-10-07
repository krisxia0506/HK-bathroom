from flask import Flask, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
from config import DB_CONFIG  # 导入配置

app = Flask(__name__)
CORS(app)


def get_data_from_database(query):
    try:
        # 连接到MySQL数据库
        connection = mysql.connector.connect(**DB_CONFIG)  # 使用导入的配置

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)

            # 执行数据库查询
            cursor.execute(query)

            # 获取查询结果
            data = cursor.fetchall()

            # 关闭数据库连接
            cursor.close()
            connection.close()

            return data, 'success'

        else:
            return None, 'Database connection failed.'

    except Error as e:
        return None, str(e)

# 定义API路由
@app.route('/get-bathroom-data-zq-female', methods=['GET'])
def get_bathroom_data_zq_female():
    query = "SELECT total - free as used, datetime FROM bathroom_people WHERE name = '华科中区男浴室' AND datetime >= NOW() - INTERVAL 24 HOUR"
    data, error = get_data_from_database(query)
    if data is not None:
        return jsonify(data)
    else:
        return jsonify({'error': error}), 500

# 定义API路由
@app.route('/get-bathroom-data-zq-male', methods=['GET'])
def get_bathroom_data_zq_male():
    query = "SELECT total - free as used, datetime FROM bathroom_people WHERE name = '华科中区女浴室' AND datetime >= NOW() - INTERVAL 24 HOUR"
    data, error = get_data_from_database(query)
    if data is not None:
        return jsonify(data)
    else:
        return jsonify({'error': error}), 500

# 定义API路由
@app.route('/get-bathroom-data-bq-female', methods=['GET'])
def get_bathroom_data_bq_female():
    query = "SELECT total - free as used, datetime FROM bathroom_people WHERE name = '华科北区男浴' AND datetime >= NOW() - INTERVAL 24 HOUR"
    data, error = get_data_from_database(query)
    if data is not None:
        return jsonify(data)
    else:
        return jsonify({'error': error}), 500

# 定义API路由
@app.route('/get-bathroom-data-bq-male', methods=['GET'])
def get_bathroom_data_bq_male():
    query = "SELECT total - free as used, datetime FROM bathroom_people WHERE name = '华科北区女浴室' AND datetime >= NOW() - INTERVAL 24 HOUR"
    data, error = get_data_from_database(query)
    if data is not None:
        return jsonify(data)
    else:
        return jsonify({'error': error}), 500

# 定义API路由
@app.route('/get_lib_data', methods=['GET'])
def get_lib_data():
    query = "SELECT * FROM lib_people_num WHERE  datetime >= NOW() - INTERVAL 24 HOUR"
    data, error = get_data_from_database(query)
    if data is not None:
        return jsonify(data)
    else:
        return jsonify({'error': error}), 500


# 启动Flask应用
if __name__ == '__main__':
    app.run(debug=True, port=64535)
