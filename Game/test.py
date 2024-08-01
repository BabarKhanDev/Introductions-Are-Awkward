from scripts.GameDatum import GameDatum

game_data = {}
game_code = "ABCD"

game_data[game_code] = GameDatum()

print(game_data[game_code].users)