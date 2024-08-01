from scripts.GameStates import GameStates

import time
import math


class GameDatum:
    def __init__(self, users=None, state=GameStates.user_login):

        if users is None:
            users = []
        self.users = users
        self.state = state
        self.timer = time.time()

    def set_timer(self, ms: int) -> None:
        self.timer = time.time() + ms / 1000

    def check_timer(self) -> bool:
        return self.timer_remaining() > 0

    def timer_remaining(self) -> int:
        # Return the number of ms until the timer expires
        time_remaining = math.floor((self.timer - time.time())*1000)
        return time_remaining
