# These will handle the requests from the web ui
import random
import string

from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from scripts.User import User
from scripts.GameDatum import GameDatum
from scripts.GameStates import GameStates
from scripts.PromptGenerator import PromptGenerator

app = Flask(__name__)
CORS(app)
prompt_generator = PromptGenerator()
"""
Game data will store a list of users and a game state
It will be of the form: string -> GameData
"""
game_data = {}



def validate_key(key: string) -> bool:
    global game_data
    if key in game_data.keys():
        return True
    return False


# Webpage delivery
@app.route('/')
def home_page():
    return render_template("home.html")


@app.route('/<key>/admin')
def admin_page(key):
    global game_data
    if key not in game_data.keys():
        return jsonify("Invalid key")
    return render_template("admin.html")


# Json handling
@app.route("/generate_key")
def generate_key():
    global game_data
    while True:
        out = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(4))
        if out not in game_data.keys():
            game_data[out] = GameDatum()
            return jsonify(out)


@app.route("/all_keys")
def all_keys():
    global game_data
    return jsonify(list(game_data.keys()))


@app.route("/<key>/new_user", methods=["POST"])
def new_user(key):
    
    if not validate_key(key):
        return jsonify("Invalid Key")
    
    global game_data
    data = request.get_json()
    username = data["username"]

    if username.lower() in [user.lower() for user in game_data[key].users]:
        return jsonify("Username Taken")

    game_data[key].users = game_data[key].users + [User(username)]
    if len(game_data[key].users) == 1:
        return jsonify("Initial User")

    return jsonify("Success")


@app.route('/<key>/get_state')
def get_state(key):
    if not validate_key(key):
        return jsonify("Invalid key")

    global game_data
    return jsonify(game_data[key].state.value)


@app.route('/<key>/all_ready')
def all_ready(key):
    # This is called when all players have connected, and we can start the game
    # We start a timer for the text harvesting stage, this is so that if anyone refreshes the page they
    # can get an updated time remaining
    if not validate_key(key):
        return jsonify("Invalid key")

    global game_data
    game_data[key].state = GameStates.text_harvesting
    game_data[key].set_timer(61000)
    return jsonify("success")


@app.route('/<key>/timer_remaining')
def timer_remaining(key):

    if not validate_key(key):
        return jsonify("Invalid key")

    global game_data
    return jsonify(game_data[key].timer_remaining())


@app.route('/<key>/all_players')
def all_players(key):
    if not validate_key(key):
        return jsonify("Invalid key")

    global game_data
    return jsonify({"players": [user.username for user in game_data[key].users]})


@app.route('/<key>/kick_player', methods=["POST"])
def kick_player(key):
    if not validate_key(key):
        return jsonify("Invalid key")

    global game_data
    game_data[key].users.remove(request.get_json()["username"])
    return jsonify("success")


@app.route('/<key>/get_prompt', methods=["POST"])
def get_prompt(key):

    if not validate_key(key):
        return jsonify("Invalid key")

    username = request.get_json()["username"]

    print(username)

    prompt = prompt_generator.prepare_prompt().split()
    names = [user.username for user in game_data[key].users]
    names.remove(username)
    print(names)
    return jsonify(" ".join(word.replace("$name", random.choice(names)) for word in prompt))

