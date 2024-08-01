# These will handle the requests from the web ui
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS

from scripts.User import User

app = Flask(__name__)
CORS(app)

users = []

"""
Webpage delivery
The following app routes deliver web pages 
"""
@app.route('/')
def hello_world():
    return render_template("home.html")


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
    print([str(user) for user in users])
    return jsonify("success")

