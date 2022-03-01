from game import Fish
from glob import glob

import json

import asyncio
import websockets

game = None

def get_hand(status=""):
    global game
    hand, num_cards, teamScore, opponentScore, currentPlayer, history = game.getGameState(0)
    cards = [card[0] + str(card[1]) for card in hand]
    return json.dumps({
        "status": status,
        "hand": ['./cards/' + card + '.png' for card in cards],
        "numCards": [int(num) for num in num_cards],
        "teamScore": teamScore,
        "opponentScore": opponentScore,
        "currentPlayer": currentPlayer,
        "history": history
    })

def start_game():
    global game
    game = Fish()
    return get_hand()

def askCard():
    global game
    card = request.args.get('card')
    player = request.args.get('player')
    status = game.askCard(card[0], int(card[1:]), 0, int(player))
    return get_hand(status)

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
    status = game.declareSuit(int(suit), int(declare_id), int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))
    return get_hand(status)

def passTurn():
    global game
    teammate = request.args.get('teammate')
    status = game.passTurn(0, int(teammate))
    return get_hand(status)

async def handler(websocket):
    while True:
        message = await websocket.recv()
        print(message)

async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future() # run forever

if __name__ == '__main__':
    asyncio.run(main())
