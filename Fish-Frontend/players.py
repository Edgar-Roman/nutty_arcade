import random
import numpy as np
from information import Information


class Player:
    def __init__(self, id, team_id, is_computer=False):
        self.id = id
        self.team_id = team_id # implement team class maybe later?
        self.name = ""
        self.is_computer = is_computer
        # game constants
        self.num_players = 6
        self.num_hs = 9
        self.num_cards_per_hs = 6
        self.can_ask_for_own_card = False
        self.hand_size_public = True
        # hand and hand-size
        self.hand = -np.ones((self.num_hs, self.num_cards_per_hs))
        self.num_cards = 0
        # computers
        self.information = Information(self.id)
        self.ask_queue = []
        self.declare_queue = []

    def initialize_hand(self, hand):
        for hs, value in hand:
            self.hand[hs, value] = 1
        self.num_cards = (self.hand == 1).sum()
        # initialize computer information
        self.information.initialize(hand)

    #
    def get_hand(self):
        return [tuple(card) for card in np.argwhere(self.hand == 1).tolist()]

    def get_valid_asks(self):
        # If out of a half-suit, we change all the values to 0 (might be dangerous)
        self.hand[np.where(np.sum(self.hand, axis=1) == -self.num_cards_per_hs)] = 0
        # return [tuple(card) for card in np.argwhere(self.hand == -1)]
        return [tuple(card) for card in np.argwhere(self.hand != 0)]


    # card is tuple (half-suit, value)
    def has_card(self, card):
        return self.hand[card] == 1

    def update(self, player_asking, card, player_questioned, got_card):
        # hand update
        if got_card:
            if self == player_asking:
                self.add_card(card)
            if self == player_questioned:
                self.remove_card(card)

        # computer information update
        # TODO: account in logic for if current player or next_player is same as self.player (maybe unnecessary?)
        hs = card[0]
        value = card[1]
        # if they are not known to have a card in the hs:
        # asking for a card implies they have an unknown card in the hs: update player status to 1 for that hs
        if np.max(self.information.card_distribution[hs, :, player_asking.id]) != 1:
            self.information.player_status[card[0], player_asking.id] = 1
        if got_card:
            # if the player has an unknown card in the hs (implicit)
            # and the card taken was unknown (0):
            # they might not have an unknown card in the hs: update player status to 0 for that hs
            if self.information.card_distribution[hs, value, player_questioned.id] == 0:
                self.information.player_status[hs, player_questioned.id] = 0

            # distribution: indicate we know where the card is and who has it
            self.information.card_distribution[hs, value, :] = -1
            self.information.card_distribution[hs, value, player_asking.id] = 1
        else:
            # distribution: indicate neither player has the card
            self.information.card_distribution[hs, value, player_asking.id] = -1
            self.information.card_distribution[hs, value, player_questioned.id] = -1
        # self.information.extrapolate(card)


    def add_card(self, card):
        self.hand[card] = 1
        self.num_cards += 1

    def remove_card(self, card):
        self.hand[card] = -1
        self.num_cards -= 1

    def remove_hs(self, hs):
        cards_to_remove = (np.sum(self.hand[hs]) + self.num_cards_per_hs) / 2
        self.num_cards -= cards_to_remove
        self.hand[hs] = -1
        # computer information update
        self.information.card_distribution[hs, :, :] = -1
        self.information.player_status[hs, :] = 0
        # self.information.extrapolate(card) probably has no effect here

    """
    Computer Only Functions below
    """

    def update_pass(self, id):
        self.information.card_distribution[:, :, id] = -1
        self.information.player_status[:, id] = 0
        # self.information.extrapolate(card)


    #
    def get_next(self, hand_sizes):  # random
        # we do this first to skip game.information.check if possible
        """
        while len(self.ask_queue) > 0:
            next_ask = self.ask_queue.pop()
            return next_ask[0], next_ask[1]

        if self.information.check_for_clear():
            # we added asks to the queue
            next_ask = self.ask_queue.pop()
            return next_ask[0], next_ask[1]
        """
        # teammates + opponents
        if self.team_id == 0:
            teammates = [0, 1, 2]
            opponents = [3, 4, 5]
        else:
            teammates = [3, 4, 5]
            opponents = [0, 1, 2]
        # if you run out of cards, pick a teammate to start
        if self.num_cards == 0:
            for id in teammates:
                if hand_sizes[id] != 0:
                    return None, id
            return None, None
        else:
            # randomly select a card and an opponent
            # valid_asks = self.get_valid_asks() allows us to ask for our own card
            # modified valid_asks so we don't ask for our own card
            self.hand[np.where(np.sum(self.hand, axis=1) == -self.num_cards_per_hs)] = 0
            valid_asks = [tuple(card) for card in np.argwhere(self.hand == -1)]
            # get random cards
            selected_card = valid_asks[random.randint(0, len(valid_asks) - 1)]
            selected_opponent = opponents[random.randint(0, len(opponents) - 1)]
            return selected_card, selected_opponent

    """
        # also need to implement declaring on other's (notably teammates') turns
        declarable = self.information.check_for_declare(game, self)
        print(self.name, "can declare", declarable)
        while len(declarable) > 0:
            suit_to_declare = declarable.pop()
            self.team.declare(self, game, suit_to_declare)
        # we do this first to skip game.information.check if possible
    """