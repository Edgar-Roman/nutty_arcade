from flask import Flask, jsonify, request
from flask_cors import CORS
from game import Fish

app = Flask(__name__)
CORS(app)

CARDS = []
game = None


@app.route("/start_game")
def start_game():
    global game
    game = Fish()
    hand = game.getGameState(0)[0]
    return

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/add")
def add():
    a = request.args.get('a')
    b = request.args.get('b')
    return jsonify({"result": int(a)+int(b)})


@app.route("/get_card")
def get_card():
    suit = request.args.get('suit')
    card = request.args.get('card')
    return jsonify({"result": './cards/' + suit + card + '.png'})


@app.route("/get_hand")
def get_hand(error="blank"):
    global CARDS
    #hand = request.args.get('cards')
    global game
    hand, num_cards, teamScore, opponentScore, currentPlayer, history = game.getGameState(0)
    cards = [card[0] + str(card[1]) for card in hand]
    #
    #cards = hand.replace(' ', '').split(',')
    #CARDS = cards
    #return jsonify({"result": ['./cards/' + card + '.png' for card in cards]})
    return jsonify({"error": error,
                    "hand": ['./cards/' + card + '.png' for card in cards],
                    "numCards": [int(num) for num in num_cards],
                    "teamScore": int(teamScore),
                    "opponentScore": int(opponentScore),
                    "currentPlayer": int(currentPlayer),
                    "history": history
                    })


@app.route("/askCard")
def askCard():
    global CARDS
    global game
    card = request.args.get('card')
    player = request.args.get('player')
    game.askCard(card[0], int(card[1]), 0, int(player))
    error = "None"
    return get_hand(error)


@app.route("/declareSuit")
def declareSuit():
    global game
    game = Fish()
    suit = request.args.get('suit')
    declare_id = 0
    id1 = request.args.get('id1')
    id2 = request.args.get('id2')
    id3 = request.args.get('id3')
    id4 = request.args.get('id4')
    id5 = request.args.get('id5')
    id6 = request.args.get('id6')
    return jsonify({"teamScore": 1, "opponentScore": 0})

    # game.declareSuit(suit, int(declare_id), int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))


@app.route("/ask")
def ask():
    teammate = request.args.get('teammate')



