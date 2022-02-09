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

    # TODO:
    def getID(self):
        pass

    #
    def getGameState(self, id):
        player = self.id2p[id]
        hand = []
        for fish_card in player.get_hand():
            hand.append(self.convertToNormalCard(fish_card))
        num_cards = []
        for id in range(self.num_players):
            num_cards = self.id2p[id].num_cards
        score = self.team_scores
        turn = self.current_player.id
        return hand, num_cards, score, turn

    #
    def askCard(self, suit, number, id1, id2):
        card = self.convertToFishCard((suit, number))
        player_asking = self.id2p[id1]
        # TODO: change assert to have meaningful frontend functionality
        assert card in player_asking.get_valid_asks(), "must be valid ask (i.e. have card in half-suit)"
        assert self.can_ask_for_own_card or not player_asking.has_card(card), "must not ask for card you have"
        player_questioned = self.id2p[id2]
        got_card = player_questioned.has_card(card)
        for id in range(self.num_players):
            player = self.id2p[id]
            player.update(player_asking, card, player_questioned, got_card)
        if not got_card:
            self.current_player.id = player_questioned.id

    def declareSuit(self, suit, declare_id, id1, id2, id3, id4, id5, id6):
        player_declaring = self.id2p[declare_id]
        ids = [id1, id2, id3, id4, id5, id6]
        declare_correct = True
        # check if declaration is correct
        for value in range(self.num_cards_per_hs):
            declared_card = (suit, value)
            declared_player = self.id2p[ids[value]]
            # TODO: change assert to have meaningful frontend functionality
            assert declared_player.team_id == player_declaring.team_id, "must declare teammate"
            declare_correct = declare_correct and declared_player.has_card(declared_card)
        if declare_correct:
            self.team_scores[player_declaring.team_id] += 1
        else:
            self.team_scores[1 - player_declaring.team_id] += 1
        # remove all cards of the half-suit after declaring
        for id in range(self.num_players):
            player = self.id2p[id]
            player.remove_hs(suit)
        # TODO: termination (maybe write helper termination function?)
        """
        if self.team_scores[0] > self.num_hs / 2:
            terminate
        elif self.team_scores[1] > self.num_hs / 2:
            terminate
        """

    # if id1 is out of cards on their turn, they can pass to a teammate id2 with cards
    def passTurn(self, id1, id2):
        # TODO: change assert to have meaningful frontend functionality
        player_passing = self.id2p[id1]
        player_next = self.id2p[id2]
        assert player_passing.num_cards == 0, "must have no cards to pass"
        assert player_next.num_cards != 0, "must pass to someone with cards"
        assert player_passing.team_id == player_next.team_id, "must pass to teammate"
        self.current_player = player_next

    # should take normal suit/number and convert it into card corresponding to tuple: (half-suit, value)
    def convertToFishCard(self, normal_card):
        suit = normal_card[0]
        number = normal_card[1]
        # TODO: representation for jokers
        if suit == 'J':
            hs = self.num_hs - 1
            value = number + 4
        elif number == 8:
            hs = self.num_hs - 1
            value = ['C', 'D', 'H', 'S'].index(suit)
        else:
            hs = 2 * ['C', 'D', 'H', 'S'].index(suit)
            if number in [2, 3, 4, 5, 6, 7]:
                # low suit
                value = [2, 3, 4, 5, 6, 7].index(number)
            else:
                # high suit
                hs += 1
                value = [9, 10, 11, 12, 13, 1].index(number)
        fish_card = (hs, value)
        return fish_card


    # should take fish_card (hs, value) and convert it into card
    def convertToNormalCard(self, fish_card):
        hs = fish_card[0]
        value = fish_card[1]
        if hs != self.num_hs - 1:
            # if not last half-suit (8s + jokers)
            suit = ['C', 'C', 'D', 'D', 'H', 'H', 'S', 'S'][hs]
            if hs % 2 == 0:
                # low suits
                number = [2, 3, 4, 5, 6, 7][value]
            else:
                # high suits
                number = [9, 10, 11, 12, 13, 1][value]
        else:
            # 8s + jokers
            if value < 4: # 8s
                suit = ['C', 'D', 'H', 'S'][value]
                number = 8
            else:
                # TODO: representation for jokers
                suit = 'J'
                number = value - 4
        normal_card = (suit, number)
        return normal_card
