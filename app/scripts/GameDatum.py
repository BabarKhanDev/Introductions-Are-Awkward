from app.scripts.GameStates import GameStates

import time
import math
import random


class GameDatum:
    def __init__(self, users=None, state=GameStates.user_login):

        if users is None:
            users = []
        self.users = users
        self.state = state
        self.timer = time.time()

        self.words = {}  # {user : [[str]]}
        self.word_list_min_len = 5

        self.round = 1

    def add_user(self, user: str) -> None:
        self.users.append(user)

    def add_users(self, users: [str]) -> None:
        for user in users:
            self.add_user(user)

    def set_timer(self, ms: int) -> None:
        self.timer = time.time() + ms / 1000

    def check_timer(self) -> bool:
        return self.timer_remaining() > 0

    def timer_remaining(self) -> int:
        # Return the number of ms until the timer expires
        time_remaining = math.floor((self.timer - time.time())*1000)
        return time_remaining

    def add_words(self, user: str, words: [str]) -> None:
        # Answers to prompts that have been answered with user as the target will be stored here
        if user not in self.words:
            self.words[user] = []
        self.words[user].append(words)

    def sample_words(self, user: str) -> [str]:
        # We want to get words that have been written about user
        users_words = self.words[user][:]
        random.shuffle(users_words)
        out = []

        for words in users_words:
            if len(out) > 50:
                return out
            if len(words) <= self.word_list_min_len:
                out.append(words)
            else:
                start_idx = random.randint(0, len(words) - self.word_list_min_len)
                end_idx = random.randint(start_idx+1, len(words))
                out.append(words[start_idx:end_idx])

        return out
