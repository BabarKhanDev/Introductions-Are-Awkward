from app.scripts.GameDatum import GameDatum


def test_add_users():
    users = ["user1", "user2", "user3"]
    datum = GameDatum()
    assert datum.users == []
    datum.add_users(users)
    assert datum.users == users


def test_add_user():
    user = "user1"
    datum = GameDatum()
    assert datum.users == []
    datum.add_user(user)
    assert datum.users == [user]


def test_initialise_with_users():
    users = ["user1", "user2", "user3"]
    datum = GameDatum(users=users)
    assert datum.users == users

