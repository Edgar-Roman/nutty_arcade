from game import Fish
from players import Player
from glob import glob

import json

import asyncio
import websockets
import secrets

JOIN = {}


def get_hand(game, player, status=""):
    hand, num_cards, teamScore, opponentScore, currentPlayer, history = game.getGameState(player)
    cards = [card[0] + str(card[1]) for card in hand]
    return {
        "status": status,
        "playerID": player,
        "hand": ['./fish_cards/' + card + '.png' for card in cards],
        "numCards": [int(num) for num in num_cards],
        "teamScore": teamScore,
        "opponentScore": opponentScore,
        "currentPlayer": currentPlayer,
        "history": history,
        "names": game.names,
    }


def askCard(game, player, card, other_player):
    status = game.askCard(card[:-1], int(card[-1]), player, int(other_player))
    return get_hand(game, player, status)


def declareSuit(game, player, suit, id1, id2, id3, id4, id5, id6):
    status = game.declareSuit(int(suit), player, int(id1), int(id2), int(id3), int(id4), int(id5), int(id6))
    return get_hand(game, player, status)


def passTurn(game, player, teammate):
    status = game.passTurn(player, int(teammate))
    return get_hand(game, player, status)


async def error(websocket, message):
    event = {
        "type": "error",
        "message": message,
    }
    await websocket.send(json.dumps(event))


async def play(websocket, join_key, player, name):
    """
    Receive and process moves from a player.
    """
    async for message in websocket:
        game, connected, names = JOIN[join_key]
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
            game = Fish(names)
            JOIN[join_key] = game, connected, names
            event = {"game":"started"}
            for connection in connected:
                if connection: # not None
                    await connection.send(json.dumps(event))
            gameState = get_hand(game, player)
        else:
            pass
        if game:
            for i, connection in enumerate(connected):
                if i != player:
                    gameState = get_hand(game, i)
                await connection.send(json.dumps(gameState))


async def createGame(websocket, name): # newer vewsion of start_game() ?
    """
    Handle a connection from the first player: start a new game.
    """
    game = None
    connected = [websocket]
    names = [name]
    
    join_key = secrets.token_urlsafe(12)
    JOIN[join_key] = game, connected, names

    try:
        # Send the secret access tokens to the browser of the first player,
        # where they'll be used for building "join" links

        event = {
            "type": "joinGame",
            "join_key": join_key,
        }
        await websocket.send(json.dumps(event))
        # Receive and process moves from the first player.
        await play(websocket, join_key, 0, name)
    finally:
        pass
        # del JOIN[join_key]


async def join(websocket, join_key, name):
    """
    Handle a connection from the second player: join an existing game
    """
    # Find the Fish game.
    try:
        game, connected, names = JOIN[join_key]
    except KeyError:
        await error(websocket, "Game not found.")
        return
    
    if name in names:
        name_index = names.index(name)
        if connected[name_index]:
            await error(websocket, "Name already taken.")
        else:
            connected[name_index] = websocket
            print(name + " rejoined")
            if game:
                event = {"game":"started"}
                await websocket.send(json.dumps(event))
                gameState = get_hand(game, name_index)
                await websocket.send(json.dumps(gameState))
            await play(websocket, join_key, name_index, name)
    else:
        if game:
            await error(websocket, "smh my head") #joined a running game, while having a new name
        connected.append(websocket)
        names.append(name)
        event = {"player_joined": len(names) - 1}
        for connection in connected:
            if connection: # not None
                await connection.send(json.dumps(event))
        await play(websocket, join_key, len(names) - 1, name)


async def handler(websocket):
    while True:
        try:
            message = await websocket.recv()
            event = json.loads(json.loads(message))
            print(type(event), event)
            if event["type"] == "createGame":
                assert("name" in event)
                await createGame(websocket, event["name"]);
            elif event["type"] == "joinGame":
                assert("name" in event)
                # Second player joins an existing game
                await join(websocket, event["join_key"], event["name"])
            else:
                pass
        except websockets.ConnectionClosedOK:
            print("someone left")
            for join_key, (game, connected, names) in JOIN.items():
                if websocket in connected:
                    websocket_index = connected.index(websocket)
                    connected[websocket_index] = None
                    print("websocket changed to none")
            break


async def main():
    async with websockets.serve(handler, "", 5000):
        await asyncio.Future() # run forever

if __name__ == '__main__':
    asyncio.run(main())
