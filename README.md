# Introductions Are Awkward

This repo stores the code for my game, Introductions Are Awkward. It's built using Flask.
Describe your friends and try to have almost everyone guess who your description is about. 
You don't want to be too specific though, because if everyone gets it then you get no points!

## Installing and Running

1. Set up environment

Open a terminal, navigate to the root of this directory and run the following:

```
cd app
python3 -m venv venv 
. venv/bin/activate (linux) or ./venv/Scripts/activate (win)
python3 -m pip install -e
python3 -m pip install -r requirements.txt
```

1. Running the app
```
export FLASK_APP=app.py
flask run
```

## Goals of this project and what I hope to learn
1. How to design UIs that look good
2. How to create websites that work well on mobile and desktop
3. How to host a website for anyone to use
