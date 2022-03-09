import random
from players import Player
#from team import Team
import itertools
import numpy as np

class Fish:
    # to do: add teams later
    def __init__(self, names=[]):
        self.terminated = False
        # initialize deck + game constants
        self.num_players = 6
        self.num_hs = 9
        self.num_cards_per_hs = 6
        self.can_ask_for_own_card = False
        self.hand_size_public = True
        # initialize players and teams
        self.id2p = {}
        self.names = []
        # hard-coding human player, index + team-index as 0
        for id in range(len(names)):
            self.id2p[id] = Player(id, id//3, is_computer=False)
            self.names.append(names[id])
        # computers
        for id in range(len(names), self.num_players):
            self.id2p[id] = Player(id, id//3, is_computer=True)
            self.names.append("Computer " + str(id))
        self.team_scores = [0, 0]
        # setup the game
        self.history = []
        self.suits_declared = [False] * self.num_hs
        self.deal_cards()
        #self.current_player = self.id2p[random.randint(0, self.num_players - 1)]
        self.current_player = self.id2p[0]

    def deal_cards(self):
        # initialize the cards and shuffle them
        cards = list(itertools.product([card for card in range(self.num_hs)], [hs for hs in range(self.num_cards_per_hs)]))
        random.shuffle(cards)

        # determine the number of players and the number of cards each player should receive, then distribute
        cards_per_player = self.num_hs * self.num_cards_per_hs / self.num_players
        for id in range(self.num_players):
            player = self.id2p[id]
            player.initialize_hand(cards[int(id * cards_per_player): int((id + 1) * cards_per_player)])

    #
    def getGameState(self, id):
        player = self.id2p[id]
        hand = []
        for fish_card in player.get_hand():
            hand.append(self.convertToNormalCard(fish_card))
        num_cards = []
        for id in range(self.num_players):
            num_cards.append(self.id2p[id].num_cards)
        score = self.team_scores
        team_id = player.team_id
        current_player = self.current_player.id
        history = self.history
        return hand, num_cards, score[team_id], score[1-team_id], current_player, history

    def declareSuit(self, suit, declare_id, id1, id2, id3, id4, id5, id6):
        if self.suits_declared[suit]:
            return "error: suit has already been declared"
        player_declaring = self.id2p[declare_id]
        ids = [id1, id2, id3, id4, id5, id6]
        declare_correct = True
        # check if declaration is correct
        for value in range(self.num_cards_per_hs):
            declared_card = (suit, value)
            declared_player = self.id2p[ids[value]]
            if declared_player.team_id != player_declaring.team_id:
                return "error: must declare teammate for each card"
            declare_correct = declare_correct and declared_player.has_card(declared_card)
        if declare_correct:
            self.team_scores[player_declaring.team_id] += 1
        else:
            self.team_scores[1 - player_declaring.team_id] += 1
        # remove all cards of the half-suit after declaring
        for id in range(self.num_players):
            player = self.id2p[id]
            player.remove_hs(suit)
        self.suits_declared[suit] = True
        # update history
        suit_name = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Grey', 'Brown', 'Black'][suit]
        if declare_correct:
            last_action = str(len(self.history) + 1) + ": Player " + str(id1) + " declares " + suit_name + " correctly."
        else:
            last_action = str(len(self.history) + 1) + ": Player " + str(id1) + " declares " + suit_name + " incorrectly."
        self.history.append(last_action)


        # termination
        """
        if self.team_scores[0] + self.team_scores[1] >= self.num_hs:
            self.terminated = True
        """
        const = self.num_hs / 2
        if self.team_scores[0] > const:
            self.terminated = True
        elif self.team_scores[1] > const:
            self.terminated = True
        #"""

        return "declare successfully processed"

    def isSameTeam(self, id1, id2):
        return (id1 // 3) == (id2 // 3)

    # check if any of the computer players have enough information to declare
    def checkComputerDeclares(self):
        for id in range(1, self.num_players): # all computer players
            comp_player = self.id2p[id]
            for hs in range(self.num_hs):
                ids_for_declaring = [] 
                for (this_hs, this_value, this_player_id), has_card in np.ndenumerate(comp_player.information.card_distribution): #ndenumerate is like multi-dimensional enumerate
                    if hs == this_hs and (has_card == 1) and self.isSameTeam(id, this_player_id):
                        ids_for_declaring.append(this_player_id)
                if len(ids_for_declaring) == self.num_cards_per_hs:
                    print(hs, id, ids_for_declaring)
                    self.declareSuit(hs, id, ids_for_declaring[0], ids_for_declaring[1], ids_for_declaring[2], ids_for_declaring[3], ids_for_declaring[4], ids_for_declaring[5])

    #
    def askCard(self, suit, number, id1, id2):
        card = self.convertToFishCard((suit, number))
        player_asking = self.id2p[id1]
        # TODO: assert player_asking is current_player
        player_questioned = self.id2p[id2]

        if player_asking.team_id == player_questioned.team_id:
            return "Error: cannot ask teammate for a card"
        if not self.can_ask_for_own_card and player_asking.has_card(card):
            return "Error: must not ask for card you have"
        if card not in player_asking.get_valid_asks():
            return "Error: must be valid ask (i.e. have card in half-suit)"


        got_card = player_questioned.has_card(card)
        for id in range(self.num_players):
            player = self.id2p[id]
            player.update(player_asking, card, player_questioned, got_card)
        if not got_card:
            self.current_player = player_questioned
        # update history
        if got_card:
            last_action = str(len(self.history) + 1) + ": Player " + str(id1) + " takes " + str(suit) + str(number) + " from Player " + str(id2) + "."
        else:
            last_action = str(len(self.history) + 1) + ": Player " + str(id1) + " asks for " + str(suit) + str(number) + " from Player " + str(id2) + "."
        self.history.append(last_action)
        # follow-up computer actions
        self.checkComputerDeclares()
        if self.current_player.is_computer and not self.terminated:
            self.computerAction(self.current_player)
        return "ask successfully processed"

    # if id1 is out of cards on their turn, they can pass to a teammate id2 with cards
    def passTurn(self, id1, id2):
        player_passing = self.id2p[id1]
        player_next = self.id2p[id2]

        if player_passing.num_cards != 0:
            return "Error: must have no cards to pass"
        if player_passing.team_id != player_next.team_id:
            return "Error: must pass to teammate"
        if player_next.num_cards == 0:
            return "Error: must pass to someone with cards" # implies you can't pass to yourself

        # update history
        last_action = str(len(self.history) + 1) + ": Player " + str(id1) + " passes turn to Player " + str(id2) + "."
        self.history.append(last_action)

        # update information to computer that player is out of cards
        for id in range(self.num_players):
            player = self.id2p[id]
            player.update_pass(player_passing.id)

        self.current_player = player_next
        # follow-up computer actions
        self.checkComputerDeclares()
        if self.current_player.is_computer and not self.terminated:
           self.computerAction(self.current_player)
        return "pass successfully processed"
    
    # computer is a Player object
    def computerAction(self, computer):
        hand_sizes = []
        for id in range(self.num_players):
            hand_sizes.append(self.id2p[id].num_cards)

        card, next_id = computer.get_next(hand_sizes)
        if card is None:
            if next_id is None:
                return # TODO: edge case where everyone out of cards (next_id is None)
            else:
                self.passTurn(computer.id, next_id)
        else:
            card = self.convertToNormalCard(card)
            self.askCard(card[0], card[1], computer.id, next_id)

    # should take normal suit/number and convert it into card corresponding to tuple: (half-suit, value)
    def convertToFishCard(self, normal_card):
        suit = normal_card[0] # color
        number = normal_card[1] # 1,2,3,4,5,6
        hs = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Grey', 'Brown', 'Black'].index(suit)
        value = number - 1
        fish_card = (hs, value)
        return fish_card

    # should take fish_card (hs, value) and convert it into card
    def convertToNormalCard(self, fish_card):
        hs = fish_card[0]
        value = fish_card[1]
        suit = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Grey', 'Brown', 'Black'][hs]
        number = value + 1
        normal_card = (suit, number)
        return normal_card

    """
    # should take normal suit/number and convert it into card corresponding to tuple: (half-suit, value)
    def convertToFishCard(self, normal_card):
        suit = normal_card[0]
        number = normal_card[1]
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
                suit = 'J'
                number = value - 4
        normal_card = (suit, number)
        return normal_card
    """


    # TODO:
    def getID(self):
        pass
