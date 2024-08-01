class User:
    def __init__(self, username):
        self.username = username

    def __hash__(self):
        return hash(self.username)

    def __eq__(self, other):
        if isinstance(other, User):
            return self.username == other.username
        if isinstance(other, str):
            return self.username == other
        return False

    def __str__(self):
        return f"User({self.username})"
