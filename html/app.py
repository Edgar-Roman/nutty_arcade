# mainly from https://stackoverflow.com/questions/59975596/connect-javascript-to-python-script-with-flask
from flask import Flask, render_template
from flask import jsonify

app = Flask(__name__)

# Display your index page
@app.route("/")
def index():
    return render_template('index.html')

# A function to add two numbers
@app.route("/add")
def add():
    a = request.args.get('a')
    b = request.args.get('b')
    return jsonify({"result": a+b})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
