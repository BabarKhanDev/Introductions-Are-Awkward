from enum import Enum


class GameStates(Enum):
    user_login = 1
    text_harvesting = 2
    making_introductions = 3
    guessing_the_friend = 4
    final_scores = 5

