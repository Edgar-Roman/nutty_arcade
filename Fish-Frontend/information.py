import numpy as np


class Information:
    def __init__(self, id, num_hs=9, num_cards_per_hs=6, num_players=6):
        self.num_hs = num_hs
        self.num_cards_per_hs = num_cards_per_hs
        self.num_players = num_players
        self.id = id
        # 0 indicates unknown, 1 indicates has the card, -1 indicates doesn't have the card
        self.card_distribution = np.zeros((num_hs, num_cards_per_hs, num_players))
        # player status: indicates whether a player has unknown cards in a half-suit
        self.player_status = np.zeros((num_hs, num_players))


    def initialize(self, hand):
        # initialize based on player's hand
        for half_suit in range(self.num_hs):
            for value in range(self.num_cards_per_hs):
                card = (half_suit, value)
                if card in hand:
                    self.card_distribution[half_suit, value, :] = -1
                    self.card_distribution[half_suit, value, self.id] = 1
                else:
                    self.card_distribution[half_suit, value, self.id] = -1

    def extrapolate(self, card):
        hs = card[0]
        # additional extrapolation (over half suits only)
        for value in range(self.num_cards_per_hs):
            # One person is unknown, everybody else doesn't have card
            if np.sum(self.card_distribution[hs, value, :]) == 1 - self.num_players:
                owner = np.where(self.card_distribution[hs, value, :] == 0)[0][0]
                # before changing, check if player status is 1 and if it is 1, change then to 0 then make the deduction
                if self.player_status[hs, owner] == 1: # (implied)
                    self.player_status[hs, owner] = 0
                self.card_distribution[hs, value, owner] = 1
        for player_id in range(self.num_players):
            # Player has an unknown card in a half suit
            if self.player_status[hs, player_id] == 1 and player_id != self.id:
                unknown_values = np.where(self.card_distribution[hs, :, player_id] == 0)[0]
                # and there is only one option for this unknown value
                if len(unknown_values) == 1:
                    # value_index = unknown_index_array[0]
                    self.card_distribution[hs, unknown_values[0], :] = -1
                    self.card_distribution[hs, unknown_values[0], player_id] = 1
                    self.player_status[hs, player_id] = 0

    """
    Checks if a player can clear some suit (has full knowledge over some suit: always safe to ask)
    """
    def check_for_clear(self):
        added_to_queue = False
        # iterate over all remaining suits
        #print(self.player.get_hand())
        for hs in range(self.num_hs):
            # TODO: check if the player has the suit & full knowledge of the suit
            #if current_player.has_hs(hs) and np.sum(self.card_status[suit_index]) == game.deck.cards_per_suit:
            #print(np.sum(np.max(self.card_distribution[hs], axis=1)))
            if np.max(self.card_distribution[hs, :, self.player_index]) == 1 and \
                    np.sum(np.max(self.card_distribution[hs], axis=1)) == self.num_cards_per_hs:
                # for each card in the suit, add to ask_queue if an opponent is holding the card
                for value in range(self.num_cards_per_hs):
                    owner_index = np.where(self.card_distribution[hs][value, :] == 1)[0]
                    # crash assertion?
                    if len(owner_index) == 0:
                        print(self.player.name, self.card_distribution[hs], "time to crash :(")
                    owner = self.players[owner_index[0]]
                    # on opposing team
                    if owner_index > len(self.players) / 2:
                        card = (hs, value)
                        self.player.ask_queue.append((card, owner))
                        added_to_queue = True
                        #printing
                        print(self.player.name, "knows", owner.name, "has the ", card, "!")
        return added_to_queue

    """
        Checks if a player can declare some suit 
        Returns list of suits that can be declared
    """

    def check_for_declare(self, game, current_player):
        declarable = []
        # iterate over all remaining suits
        for suit in game.deck.suits:
            can_declare_suit = False
            # TODO: Find a better way to represent suit index instead of hard-coding it
            suit_index = suit - 1
            # check if the player has the suit & full knowledge of the suit
            if current_player.has_suit(suit) and np.sum(self.card_status[suit_index]) == game.deck.cards_per_suit:
                can_declare_suit = True
                # for each card in the suit, add to ask_queue if an opponent is holding the card
                for value_index in range(game.deck.cards_per_suit):
                    owner_index = np.where(self.card_distribution[suit_index][value_index, :] == 1)[0]
                    # print("owner_index", owner_index, "owns", game.deck.values[value_index], "of", suit)
                    if len(owner_index) == 0:
                        print(current_player.name, self.card_distribution[suit_index], self.card_status[suit_index], "time to crash :(")
                    owner = game.players[owner_index[0]]
                    # cannot declare the suit if someone on opposite team has card
                    if current_player.team != owner.team:
                        can_declare_suit = False
            # add the suit to declareable
            if can_declare_suit:
                declarable.append(suit)
        return declarable
