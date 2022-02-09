import random
from players import Player
#from team import Team
import itertools

class Fish:
    # to do: add teams later
    def __init__(self):
        # initialize deck + game constants
        self.num_players = 6
        self.num_hs = 9
        self.num_cards_per_hs = 6
        self.can_ask_for_own_card = False
        self.hand_size_public = True
        # initialize players and teams
        self.id2p = {}
        for id in range(self.num_players):
            team_id = (2 * id) // self.num_players
            self.id2p[id] = Player(id, team_id)
        self.team_scores = (0, 0)
        # setup the game
        self.deal_cards()
        self.current_player = self.id2p[random.randint(0, self.num_players - 1)]

    def deal_cards(self):
        # initialize the cards and shuffle them
        cards = list(itertools.product([card for card in range(self.num_hs)], [hs for hs in range(self.num_cards_per_hs)]))
        random.shuffle(cards)

        # determine the number of players and the number of cards each player should receive, then distribute
        cards_per_player = self.num_hs * self.num_cards_per_hs / self.num_players
        for id in range(self.num_players):
            player = self.id2p[id]
            player.initialize_hand(cards[int(id * cards_per_player): int((id + 1) * cards_per_player)])

    # integration or smth idk
    def assignPlayer2ID(self):
        pass

    """
    returns value
    {
    hand: list(tuples) // TUPLE IS ('SUIT', NUM) e.g. ('C', 4) A - 1, JQK 11-13
    num_cards: list(int) // LENGTH IS 6
    score: tuple // LENGTH IS 2
    turn: int //0-5
    }
    """
    def getGameState(self, id):
        player = self.id2p[id]
        for i in range(self.num_players):
            player = self.id2p[i]
            hand = player.get_hand() # need to convert cards from fish format into (suit, num) format
            num_cards = player.num_cards
        score = self.team_scores
        turn = self.current_player.id
        pass

    # assert ask is legal
    def askCard(self, suit, number, id1, id2):
        card = self.convertToFishCard(suit, number)
        player_asking = self.id2p[id1]
        player_questioned = self.id2p[id2]
        got_card = player_questioned.hasCard(card)
        for id in range(self.num_players):
            player = self.id2p[id]
            player.update(player_asking, card, player_questioned, got_card)
        if not got_card:
            self.current_player.id = player_questioned.id

    #id is id corresponding to each card
    def declareSuit(self, suit, declare_id, id1, id2, id3, id4, id5, id6):
        ids = [id1, id2, id3, id4, id5, id6]
        declare_correct = True
        for value in range(self.num_cards_per_hs):
            declared_card = (suit, value)
            declared_player = self.id2p[ids[value]]
            # need to enforce these ids are on the same team as id_declare
            declare_correct = declare_correct and declared_player.has_card(declared_card)
        if declare_correct:
            self.team_scores[declare_id.team_id] += 1
        else:
            self.team_scores[1 - declare_id.team_id] += 1
        # remove all cards of the half-suit after declaring
        for id in range(self.num_players):
            player = self.id2p[id]
            player.remove_hs(suit)

    # should take normal suit/number and convert it into card corresponding to tuple: (half-suit, value)
    def convertToFishCard(self, suit, number):
        return card

    # should take fish (hs, value) and convert it into card
    def convertToNormalCard(self, hs, value):
        return card
