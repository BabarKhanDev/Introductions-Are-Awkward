# Introductions Are Awkward

Describe your friends and try to have _almost_ everyone guess who your description is about. 
You don't want to be too specific though, because if everyone gets it then you get no points!

## Running without Docker

Open a terminal, navigate to the root of this directory and run the following:

```
cd app
python3 -m venv venv 
. venv/bin/activate (linux) or .\venv\Scripts\activate (win)
python3 -m pip install -r requirements.txt
flask run
```

## Running with Docker

Open a terminal, navigate to the root of this directory and run the following:

```
docker build -t introductions_are_awkward .
docker run -d --name introductions_are_awkward -p 8080:8080 introductions_are_awkward
```

## Goals of this project and what I hope to learn

1. How to design UIs that look good
2. How to create websites that work well on mobile and desktop
3. How to host a website for anyone to use
