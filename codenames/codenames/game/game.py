import random
from typing import List

from codenames.game.board import Card, CardType, Position, Clue
from codenames.inference.ai_spymaster import initialize_ai_spymaster, initialize_game_thread, get_spymaster_clue

WORD_LIST = ["Acne", "Acre", "Addendum", "Advertise", "Aircraft", "Aisle", "Alligator", "Alphabetize", "America", "Ankle", "Apathy", "Applause", "Applesauce", "Application", "Archaeologist", "Aristocrat", "Arm", "Armada", "Asleep", "Astronaut", "Athlete", "Atlantis", "Aunt", "Avocado", "Baby","Sitter", "Backbone", "Bag", "Baguette", "Bald", "Balloon", "Banana", "Banister", "Baseball", "Baseboards", "Basketball", "Bat", "Battery", "Beach", "Beanstalk", "Bedbug", "Beer", "Beethoven", "Belt", "Bib", "Bicycle", "Big", "Bike", "Billboard", "Bird", "Birthday", "Bite", "Blacksmith", "Blanket", "Bleach", "Blimp", "Blossom", "Blueprint", "Blunt", "Blur", "Boa", "Boat", "Bob", "Bobsled", "Body", "Bomb", "Bonnet", "Book", "Booth", "Bowtie", "Box", "Boy", "Brainstorm", "Brand", "Brave", "Bride", "Bridge", "Broccoli", "Broken", "Broom", "Bruise", "Brunette", "Bubble", "Buddy", "Buffalo", "Bulb", "Bunny", "Bus", "Buy", "Cabin", "Cafeteria", "Cake", "Calculator", "Campsite", "Can", "Canada", "Candle", "Candy", "Cape", "Capitalism", "Car", "Cardboard", "Cartography", "Cat", "Cd", "Ceiling", "Cell", "Century", "Chair", "Chalk", "Champion", "Charger", "Cheerleader", "Chef", "Chess", "Chew", "Chicken", "Chime", "China", "Chocolate", "Church", "Circus", "Clay", "Cliff", "Cloak", "Clockwork", "Clown", "Clue", "Coach", "Coal", "Coaster", "Cog", "Cold", "College", "Comfort", "Computer", "Cone", "Constrictor", "Continuum", "Conversation", "Cook", "Coop", "Cord", "Corduroy", "Cot", "Cough", "Cow", "Cowboy", "Crayon", "Cream", "Crisp", "Criticize", "Crow", "Cruise", "Crumb", "Crust", "Cuff", "Curtain", "Cuticle", "Czar", "Dad", "Dart", "Dawn", "Day", "Deep", "Defect", "Dent", "Dentist", "Desk", "Dictionary", "Dimple", "Dirty", "Dismantle", "Ditch", "Diver", "Doctor", "Dog", "Doghouse", "Doll", "Dominoes", "Door", "Dot", "Drain", "Draw", "Dream", "Dress", "Drink", "Drip", "Drums", "Dryer", "Duck", "Dump", "Dunk", "Dust", "Ear", "Eat", "Ebony", "Elbow", "Electricity", "Elephant", "Elevator", "Elf", "Elm", "Engine", "England", "Ergonomic", "Escalator", "Eureka", "Europe", "Evolution", "Extension", "Eyebrow", "Fan", "Fancy", "Fast", "Feast", "Fence", "Feudalism", "Fiddle", "Figment", "Finger", "Fire", "First", "Fishing", "Fix", "Fizz", "Flagpole", "Flannel", "Flashlight", "Flock", "Flotsam", "Flower", "Flu", "Flush", "Flutter", "Fog", "Foil", "Football", "Forehead", "Forever", "Fortnight", "France", "Freckle", "Freight", "Fringe", "Frog", "Frown", "Gallop", "Game", "Garbage", "Garden", "Gasoline", "Gem", "Ginger", "Gingerbread", "Girl", "Glasses", "Goblin", "Gold", "Goodbye", "Grandpa", "Grape", "Grass", "Gratitude", "Gray", "Green", "Guitar", "Gum", "Gumball", "Hair", "Half", "Handle", "Handwriting", "Hang", "Happy", "Hat", "Hatch", "Headache", "Heart", "Hedge", "Helicopter", "Hem", "Hide", "Hill", "Hockey", "Homework", "Honk", "Hopscotch", "Horse", "Hose", "Hot", "House", "Houseboat", "Hug", "Humidifier", "Hungry", "Hurdle", "Hurt", "Hut", "Ice", "Implode", "Inn", "Inquisition", "Intern", "Internet", "Invitation", "Ironic", "Ivory", "Ivy", "Jade", "Japan", "Jeans", "Jelly", "Jet", "Jig", "Jog", "Journal", "Jump", "Key", "Killer", "Kilogram", "King", "Kitchen", "Kite", "Knee", "Kneel", "Knife", "Knight", "Koala", "Lace", "Ladder", "Ladybug", "Lag", "Landfill", "Lap", "Laugh", "Laundry", "Law", "Lawn", "Lawnmower", "Leak", "Leg", "Letter", "Level", "Lifestyle", "Ligament", "Light", "Lightsaber", "Lime", "Lion", "Lizard", "Log", "Loiterer", "Lollipop", "Loveseat", "Loyalty", "Lunch", "Lunchbox", "Lyrics", "Machine", "Macho", "Mailbox", "Mammoth", "Mark", "Mars", "Mascot", "Mast", "Matchstick", "Mate", "Mattress", "Mess", "Mexico", "Midsummer", "Mine", "Mistake", "Modern", "Mold", "Mom", "Monday", "Money", "Monitor", "Monster", "Mooch", "Moon", "Mop", "Moth", "Motorcycle", "Mountain", "Mouse", "Mower", "Mud", "Music", "Mute", "Nature", "Negotiate", "Neighbor", "Nest", "Neutron", "Niece", "Night", "Nightmare", "Nose", "Oar", "Observatory", "Office", "Oil", "Old", "Olympian", "Opaque", "Opener", "Orbit", "Organ", "Organize", "Outer", "Outside", "Ovation", "Overture", "Pail", "Paint", "Pajamas", "Palace", "Pants", "Paper", "Paper", "Park", "Parody", "Party", "Password", "Pastry", "Pawn", "Pear", "Pen", "Pencil", "Pendulum", "Penis", "Penny", "Pepper", "Personal", "Philosopher", "Phone", "Photograph", "Piano", "Picnic", "Pigpen", "Pillow", "Pilot", "Pinch", "Ping", "Pinwheel", "Pirate", "Plaid", "Plan", "Plank", "Plate", "Platypus", "Playground", "Plow", "Plumber", "Pocket", "Poem", "Point", "Pole", "Pomp", "Pong", "Pool", "Popsicle", "Population", "Portfolio", "Positive", "Post", "Princess", "Procrastinate", "Protestant", "Psychologist", "Publisher", "Punk", "Puppet", "Puppy", "Push", "Puzzle", "Quarantine", "Queen", "Quicksand", "Quiet", "Race", "Radio", "Raft", "Rag", "Rainbow", "Rainwater", "Random", "Ray", "Recycle", "Red", "Regret", "Reimbursement", "Retaliate", "Rib", "Riddle", "Rim", "Rink", "Roller", "Room", "Rose", "Round", "Roundabout", "Rung", "Runt", "Rut", "Sad", "Safe", "Salmon", "Salt", "Sandbox", "Sandcastle", "Sandwich", "Sash", "Satellite", "Scar", "Scared", "School", "Scoundrel", "Scramble", "Scuff", "Seashell", "Season", "Sentence", "Sequins", "Set", "Shaft", "Shallow", "Shampoo", "Shark", "Sheep", "Sheets", "Sheriff", "Shipwreck", "Shirt", "Shoelace", "Short", "Shower", "Shrink", "Sick", "Siesta", "Silhouette", "Singer", "Sip", "Skate", "Skating", "Ski", "Slam", "Sleep", "Sling", "Slow", "Slump", "Smith", "Sneeze", "Snow", "Snuggle", "Song", "Space", "Spare", "Speakers", "Spider", "Spit", "Sponge", "Spool", "Spoon", "Spring", "Sprinkler", "Spy", "Square", "Squint", "Stairs", "Standing", "Star", "State", "Stick", "Stockholder", "Stoplight", "Stout", "Stove", "Stowaway", "Straw", "Stream", "Streamline", "Stripe", "Student", "Sun", "Sunburn", "Sushi", "Swamp", "Swarm", "Sweater", "Swimming", "Swing", "Tachometer", "Talk", "Taxi", "Teacher", "Teapot", "Teenager", "Telephone", "Ten", "Tennis", "Thief", "Think", "Throne", "Through", "Thunder", "Tide", "Tiger", "Time", "Tinting", "Tiptoe", "Tiptop", "Tired", "Tissue", "Toast", "Toilet", "Tool", "Toothbrush", "Tornado", "Tournament", "Tractor", "Train", "Trash", "Treasure", "Tree", "Triangle", "Trip", "Truck", "Tub", "Tuba", "Tutor", "Television", "Twang", "Twig", "Twitterpated", "Type", "Unemployed", "Upgrade", "Vest", "Vision", "Wag", "Water", "Watermelon", "Wax", "Wedding", "Weed", "Welder", "Whatever", "Wheelchair", "Whiplash", "Whisk", "Whistle", "White", "Wig", "Will", "Windmill", "Winter", "Wish", "Wolf", "Wool", "World", "Worm", "Wristwatch", "Yardstick", "Zamboni", "Zen", "Zero", "Zipper", "Zone", "Zoo"]

# Making this a singleton instance for now, will do something fancy w redis & threads later
class CodenamesGame():
    _instance = None 
    
    def __init__(self):
        self.board = self.initiate_board()
        self.openai_thread = initialize_game_thread()
        self.red_spymaster = initialize_ai_spymaster("red")
        self.blue_spymaster = initialize_ai_spymaster("blue")
        self.red_operatives = []
        self.blue_operatives = []
        self.red_clues = []
        self.blue_clues = []
        self.red_guesses = []
        self.blue_guesses = []
        self.red_score = 0
        self.blue_score = 0
        self.red_turn = True
        self.winner = None
        self.turn_count = 0
        
    @classmethod
    def get_game(cls):
        if not cls._instance:
            cls._instance = CodenamesGame()
        return cls._instance
    
    def generate_clue(self):
        if self.red_turn:
            self.red_clues.append(get_spymaster_clue(self.board, self.openai_thread.id, self.red_spymaster.id))
        else:
            self.blue_clues.append(get_spymaster_clue(self.board, self.openai_thread.id, self.blue_spymaster.id))
        self.turn_count = self.get_current_clue().number + 1
        
    def get_current_clue(self) -> Clue:
        if self.red_turn:
            return self.red_clues[-1]
        else:
            return self.blue_clues[-1]
        
    def get_card(self, position: Position) -> Card:
        for card in self.board:
            if card.position.x == position.x and card.position.y == position.y:
                return card
        return None
    
    def reveal_card(self, position: Position) -> Card:
        guessed_card = self.get_card(position)
        guessed_card.is_revealed = True
        match guessed_card.type_value:
            case CardType.RED_AGENT:
                print("Red agent!\n")
                self.red_score += 1
                if self.red_score == 9:
                    self.winner = "red"
                    self.game_recap()
                    return
                # it was blue's turn, so set turn to red and generate a new clue
                if not self.red_turn:
                    self.end_turn()
                else:
                    self.turn_count -= 1
                    if self.turn_count <= 0:
                        print(f"Out of turns!")
                        self.end_turn()
            case CardType.BLUE_AGENT:
                print("Blue agent!\n")
                self.blue_score += 1
                if self.blue_score == 8:
                    self.winner = "blue"
                    self.game_recap()
                    return
                if self.red_turn:
                    self.end_turn()
                else:
                    self.turn_count -= 1
                    if self.turn_count <= 0:
                        print(f"Out of turns!")
                        self.end_turn()
            case CardType.BYSTANDER:
                print("Bystander!\n")
                self.end_turn()
            case CardType.ASSASSIN:
                print("Assassin!\n")
                self.winner = "blue" if self.red_turn else "red"
                self.game_recap()
                return
                
    def end_turn(self):
        self.red_turn = not self.red_turn
        self.generate_clue()

    def initiate_board(self) -> List[Card]:
        # pick 25 random words from the word list
        # being lazy and just making it a set, so we don't have to worry about duplicates
        selected_words = set()
        deck = set()
        while len(selected_words) < 25:
            selected_words.add(random.choice(WORD_LIST))
            
        position_opts = [(x, y) for x in range(5) for y in range(5)]

        # assign 9 words to be red agents
        for _ in range(9):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.RED_AGENT, position=random_position(position_opts)))
        # assign 8 words to be blue agents
        for _ in range(8):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.BLUE_AGENT, position=random_position(position_opts)))
        # assign 7 words to be bystanders
        for _ in range(7):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.BYSTANDER, position=random_position(position_opts)))
        # assign 1 word to be the assassin
        deck.add(Card(word_value=selected_words.pop(), type_value=CardType.ASSASSIN, position=random_position(position_opts)))
        
        # return the board
        # board_string = "\n".join([str(card) for card in final_board])
        # print(board_string)
        return deck
    
    def game_recap(self):
        print("Game Recap:\n")
        print(f"Red clues: {[str(clue) for clue in self.red_clues]}\n")
        print(f"Blue clues: {[str(clue) for clue in self.blue_clues]}\n")

def random_position(position_opts) -> Position:
    coords = random.choice(position_opts)
    position_opts.remove(coords)
    return Position(x=coords[0], y=coords[1])

if __name__ == "__main__":
    game = CodenamesGame()
    prev_turn = not game.red_turn
    while True:
        board_string = "\n".join([str(card) for card in game.board])
        print(board_string + "\n")
        # If the turn has changed, we need a new clue:
        if prev_turn != game.red_turn:
            if game.red_turn:
                print("Red turn:\n")
                game.red_clues.append(get_spymaster_clue(game.board, game.openai_thread.id, game.red_spymaster.id))
            else:
                print("Blue turn\n")
                game.blue_clues.append(get_spymaster_clue(game.board, game.openai_thread.id, game.blue_spymaster.id))
            turn_count = game.get_current_clue().number + 1

        prev_turn = game.red_turn
        print(f"Current turn: {'red' if game.red_turn else 'blue'}")
        print(f"Guesses remaining: {turn_count}")
        print(f"Current clue: {game.get_current_clue().text}, {game.get_current_clue().number}")
        choice = input("Enter a position to guess (format: x,y), or 'next' to end turn:\n")
        if choice == "next":
            game.end_turn()
            continue
        if choice == "end":
            break
        guess_position = Position(int(choice.split(",")[0]), int(choice.split(",")[1]))
        game.reveal_card(guess_position)
        if game.winner:
            print(f"{game.winner} wins!")
            break
        turn_count -= 1
        if turn_count <= 0:
            print(f"Out of turns!")
            game.end_turn()
        
    # Game Recap (for debugging)
    print("Game Recap:\n")
    print(f"Red clues: {[str(clue) for clue in game.red_clues]}\n")
    print(f"Blue clues: {[str(clue) for clue in game.blue_clues]}\n")
    
