# mainly from https://stackoverflow.com/questions/59975596/connect-javascript-to-python-script-with-flask
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# A function to add two numbers
@app.route("/add")
def add():
    a = request.args.get('a')
    b = request.args.get('b')
    return jsonify({"result": int(a)+int(b)})

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
