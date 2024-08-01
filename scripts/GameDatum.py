from scripts.GameStates import GameStates


class GameDatum:
    def __init__(self, users=None, state=GameStates.user_login):

        if users is None:
            users = []
        self.users = users
        self.state = state
