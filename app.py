#!flask/bin/python
from flask import Flask
from flask import jsonify
from flask_cors import CORS
import requests

app = Flask(__name__, static_url_path='')
CORS(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/getImages')
def get_data():
    r = requests.get('http://campaigns.celtra.com/developer-tasks/swipey-gallery/')
    jsresp = r.json()
    return jsonify(jsresp)


if __name__ == '__main__':
    app.run(debug=True)
