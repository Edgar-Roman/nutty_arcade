from flask import Flask, jsonify, request
from flask_cors import CORS
from game import Fish

app = Flask(__name__)
CORS(app)

CARDS = []
game = None

@app.route("/get_hand")
def get_hand(error="blank"):
    global game
    hand, num_cards, teamScore, opponentScore, currentPlayer, history = game.getGameState(0)
    cards = [card[0] + str(card[1]) for card in hand]
    return jsonify({
        "error": error,
        "hand": ['./cards/' + card + '.png' for card in cards],
        "numCards": [int(num) for num in num_cards],
        "teamScore": teamScore,
        "opponentScore": opponentScore,
        "currentPlayer": currentPlayer,
        "history": history
    })

@app.route("/start_game")
def start_game():
    global game
    game = Fish()
    return get_hand()

@app.route("/askCard")
def askCard():
    global game
    card = request.args.get('card')
    player = request.args.get('player')
    error = game.askCard(card[0], int(card[1]), 0, int(player))
    return get_hand(error)


@app.route("/declareSuit")
def declareSuit():
    global game
    suit = request.args.get('suit')
    declare_id = 0
    id1 = request.args.get('id1')
    id2 = request.args.get('id2')
    id3 = request.args.get('id3')
    id4 = request.args.get('id4')
    id5 = request.args.get('id5')
    id6 = request.args.get('id6')
    error = game.declareSuit(int(suit), int(declare_id), int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))
    return get_hand(error)


@app.route("/passTurn")
def passTurn():
    global game
    teammate = request.args.get('teammate')
    error = game.passTurn(0, int(teammate))
    return get_hand(error)


@app.route("/get_card")
def get_card():
    suit = request.args.get('suit')
    card = request.args.get('card')
    return jsonify({"result": './cards/' + suit + card + '.png'})
