import random


def generate_color() -> str:
    with open("util/colours.txt", "r") as file:
        return random.choice(file.readlines()).strip()


def generate_country() -> str:
    with open("util/countries.txt", "r") as file:
        return random.choice(file.readlines()).strip()


def generate_animal() -> str:
    with open("util/animals.txt", "r") as file:
        return random.choice(file.readlines()).strip()


class PromptGenerator:
    def __init__(self):
        """
        We process a random item from self.prompts and replace tags with random items
        example tags:
            $name will be replaced by the name of a player
        """
        with open("util/prompts.txt", "r") as file:
            self.prompts = file.readlines()

    def prepare_prompt(self):
        prompt = random.choice(self.prompts).split()
        prompt = ' '.join(word.replace("$colour", generate_color()) for word in prompt).split()
        prompt = ' '.join(word.replace("$animal", generate_animal()) for word in prompt).split()
        prompt = ' '.join(word.replace("$country", generate_country()) for word in prompt)
        return prompt


if __name__ == "__main__":
    prompt_generator = PromptGenerator()
    for _ in range(5):
        print(prompt_generator.prepare_prompt())
    print("")
