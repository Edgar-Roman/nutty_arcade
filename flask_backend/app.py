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

#getGameState request
@app.route("/getGameState")
def getGameState():
    ID = int(request.args.get('ID'))
    # result = game.getGameState(int(ID))

    # placeholder dummy implementation
    hand = [('C', 4), ('D', 5)]
    num_cards = [2, 2, 2, 2, 2, 2]
    score = (1, 1)
    turn = (ID + 1) % 6
    result = {"hand": hand, "num_cards": num_cards, "score": score, "turn": turn}
    return jsonify(result)

#getID request
@app.route("/getID")
def getID():
    # result = game.getID()

    # placeholder dummy implementation
    result = {"ID": 4} # definitely random
    return jsonify(result)

#startGame post
@app.route("/startGame")
def startGame():
    # placeholder
    # game = Game()
    pass

#askCard post
@app.route("/askCard")
def askCard():
    suit = request.args.get('suit')
    number = request.args.get('number')
    id1 = request.args.get('id1')
    id2 = request.args.get('id2')
    # game.askCard(suit, int(number), int(id1), int(id2))

# declareSuit post
@app.route("/declareSuit")
def declareSuit():
    suit = request.args.get('suit')
    declare_id = request.args.get('declare_id')
    id1 = request.args.get('id1')
    id2 = request.args.get('id2')
    id3 = request.args.get('id3')
    id4 = request.args.get('id4')
    id5 = request.args.get('id5')
    id6 = request.args.get('id6')
    # game.declareSuit(suit, int(declare_id), int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))

if __name__ == "__main__":
    app.debug = True
    app.run()
