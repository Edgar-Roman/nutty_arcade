from game import Fish
from players import Player
from glob import glob

import json

import asyncio
import websockets
import secrets

numHumanPlayers = 0

JOIN = {}


def get_hand(game, player, status=""):
    hand, num_cards, teamScore, opponentScore, currentPlayer, history = game.getGameState(player)
    cards = [card[0] + str(card[1]) for card in hand]
    return {
        "status": status,
        "playerID": player,
        "hand": ['./cards/' + card + '.png' for card in cards],
        "numCards": [int(num) for num in num_cards],
        "teamScore": teamScore,
        "opponentScore": opponentScore,
        "currentPlayer": currentPlayer,
        "history": history
    }


def askCard(game, player, card, other_player):
    status = game.askCard(card[0], int(card[1:]), player, int(other_player))
    return get_hand(game, player, status)


def declareSuit(game, player, suit, id1, id2, id3, id4, id5, id6):
    status = game.declareSuit(int(suit), player, int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))
    return get_hand(status)


def passTurn(game, player, teammate):
    status = game.passTurn(player, int(teammate))
    return get_hand(status)


async def error(websocket, message):
    event = {
        "type": "error",
        "message": message,
    }
    await websocket.send(json.dumps(event))


async def play(websocket, game, player, connected):
    """
    Receive and process moves from a player.
    """
    async for message in websocket:
        # parse input from UI
        event = json.loads(json.loads(message))
        print(type(event), event)
        gameState = None
        if event["type"] == "askCard":
            card = event["card"]
            other_player = event["player"]
            gameState = askCard(game, player, card, other_player)
        elif event["type"] == "declareSuit":
            suit = event["suit"]
            id1 = event["id1"]
            id2 = event["id2"]
            id3 = event["id3"]
            id4 = event["id4"]
            id5 = event["id5"]
            id6 = event["id6"]
            gameState = declareSuit(game, player, suit, id1, id2, id3, id4, id5, id6)
        elif event["type"] == "passTurn":
            teammate = event["teammate"]
            gameState = passTurn(game, player, teammate)
        elif event["type"] == "getHand":
            gameState = get_hand(game, player)
        elif event["type"] == "startGame":
            game = Fish(numHumanPlayers)
            event = {"game":"started"}
            websockets.broadcast(connected, json.dumps(event))
            gameState = get_hand(game, player)
        else:
            pass # input wrong type?
        if game:
            for i, connection in enumerate(connected):
                if i != player:
                    gameState = get_hand(game, i)
                await connection.send(json.dumps(gameState))


async def createGame(websocket): # newer vewsion of start_game() ?
    """
    Handle a connection from the first player: start a new game.
    """
    game = None
    connected = [websocket]
    
    join_key = secrets.token_urlsafe(12)
    JOIN[join_key] = game, connected

    try:
        # Send the secret access tokens to the browser of the first player,
        # where they'll be used for building "join" links

        event = {
            "type": "joinGame",
            "join_key": join_key,
        }
        await websocket.send(json.dumps(event))
        # Receive and process moves from the first player.
        await play(websocket, game, 0, connected)
        global numHumanPlayers
        numHumanPlayers += 1
    finally:
        del JOIN[join_key]


async def join(websocket, join_key):
    """
    Handle a connection from the second player: join an existing game
    """
    # Find the Fish game.
    try:
        game, connected = JOIN[join_key]
    except KeyError:
        await error(websocket, "Game not found.")
        return

    # Register to receive moves from this game
    connected.append(websocket)
    global numHumanPlayers
    numHumanPlayers += 1
    event = {"player_joined": numHumanPlayers}
    websockets.broadcast(connected, json.dumps(event))
    await play(websocket, game, numHumanPlayers, connected)


async def handler(websocket):
    while True:
        message = await websocket.recv()
        event = json.loads(json.loads(message))
        print(type(event), event)

        if event["type"] == "createGame":
            await createGame(websocket);
        elif event["type"] == "joinGame":
            # Second player joins an existing game
            await join(websocket, event["join_key"])
        else:
            pass


async def main():
    async with websockets.serve(handler, "", 5000):
        await asyncio.Future() # run forever

if __name__ == '__main__':
    asyncio.run(main())
