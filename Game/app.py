# These will handle the requests from the web ui
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
from enum import Enum

from scripts.User import User


# Game States
class GameStates(Enum):
    user_login = 1
    text_harvesting = 2
    making_introductions = 3
    guessing_the_friend = 4
    final_scores = 5


# Set up variables
app = Flask(__name__)
CORS(app)
users = []
game_state = GameStates.user_login

"""
Webpage delivery
The following app routes deliver web pages 
"""
@app.route('/')
def home_page():
    return render_template("home.html")


@app.route('/admin')
def admin_page():
    return render_template("admin.html")

"""
Json handling
"""
@app.route("/new_user", methods = ["POST"])
def new_user():
    global users
    data = request.get_json()
    username = data["username"]
    if username in users:
        return jsonify("fail")
    users.append(User(username))
    if len(users) == 1:
        return jsonify("initial_user")
    return jsonify("success")


@app.route('/get_state')
def get_state():
    return jsonify(game_state.value)


@app.route('/all_ready')
def all_ready():
    global game_state
    game_state = GameStates.text_harvesting
    return jsonify("success")


@app.route('/all_players')
def all_players():
    global users
    return jsonify({"players": [user.username for user in users]})


@app.route('/kick_player', methods=["POST"])
def kick_player():
    global users
    users.remove(request.get_json()["username"])
    return "success"
