from app.scripts.GameStates import GameStates
from app.scripts.Introduction import Introduction

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

        # Text harvesting stage
        self.words = {}  # {user : [[str]]}
        self.word_list_min_len = 5

        # Introductions stage
        self.round = 1
        self.introductions = []
        self.user_introduction_words_map = {}

    def add_user(self, user: str) -> None:
        self.users += [user]

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

        if user not in self.words:
            return f"Nobody wrote anything about {user}, how sad :(".split(" ")

        # Prepare data
        users_words = self.words[user][:]
        users_words = list(filter(lambda x: x != '', users_words))
        users_words = [word.split(" ") for word in users_words]
        users_words = [word for sentence in users_words for word in sentence]
        random.shuffle(users_words)

        if len(users_words) < self.word_list_min_len:
            users_words += "Not much else is known about them".split(" ")
            return users_words

        return [users_words[i] for i in sorted(random.sample(range(len(users_words)), min(30, len(users_words))))]

    def add_introduction(self, introduction: Introduction) -> None:
        self.introductions.append(introduction)
