import random
from typing import List

from codenames.schema.schema import Card, CardType, Position
from codenames.inference.ai_spymaster import initialize_ai_spymaster, initialize_game_thread, get_spymaster_clue

WORD_LIST = ["Acne", "Acre", "Addendum", "Advertise", "Aircraft", "Aisle", "Alligator", "Alphabetize", "America", "Ankle", "Apathy", "Applause", "Applesauc", "Application", "Archaeologist", "Aristocrat", "Arm", "Armada", "Asleep", "Astronaut", "Athlete", "Atlantis", "Aunt", "Avocado", "Baby","Sitter", "Backbone", "Bag", "Baguette", "Bald", "Balloon", "Banana", "Banister", "Baseball", "Baseboards", "Basketball", "Bat", "Battery", "Beach", "Beanstalk", "Bedbug", "Beer", "Beethoven", "Belt", "Bib", "Bicycle", "Big", "Bike", "Billboard", "Bird", "Birthday", "Bite", "Blacksmith", "Blanket", "Bleach", "Blimp", "Blossom", "Blueprint", "Blunt", "Blur", "Boa", "Boat", "Bob", "Bobsled", "Body", "Bomb", "Bonnet", "Book", "Booth", "Bowtie", "Box", "Boy", "Brainstorm", "Brand", "Brave", "Bride", "Bridge", "Broccoli", "Broken", "Broom", "Bruise", "Brunette", "Bubble", "Buddy", "Buffalo", "Bulb", "Bunny", "Bus", "Buy", "Cabin", "Cafeteria", "Cake", "Calculator", "Campsite", "Can", "Canada", "Candle", "Candy", "Cape", "Capitalism", "Car", "Cardboard", "Cartography", "Cat", "Cd", "Ceiling", "Cell", "Century", "Chair", "Chalk", "Champion", "Charger", "Cheerleader", "Chef", "Chess", "Chew", "Chicken", "Chime", "China", "Chocolate", "Church", "Circus", "Clay", "Cliff", "Cloak", "Clockwork", "Clown", "Clue", "Coach", "Coal", "Coaster", "Cog", "Cold", "College", "Comfort", "Computer", "Cone", "Constrictor", "Continuum", "Conversation", "Cook", "Coop", "Cord", "Corduroy", "Cot", "Cough", "Cow", "Cowboy", "Crayon", "Cream", "Crisp", "Criticize", "Crow", "Cruise", "Crumb", "Crust", "Cuff", "Curtain", "Cuticle", "Czar", "Dad", "Dart", "Dawn", "Day", "Deep", "Defect", "Dent", "Dentist", "Desk", "Dictionary", "Dimple", "Dirty", "Dismantle", "Ditch", "Diver", "Doctor", "Dog", "Doghouse", "Doll", "Dominoes", "Door", "Dot", "Drain", "Draw", "Dream", "Dress", "Drink", "Drip", "Drums", "Dryer", "Duck", "Dump", "Dunk", "Dust", "Ear", "Eat", "Ebony", "Elbow", "Electricity", "Elephant", "Elevator", "Elf", "Elm", "Engine", "England", "Ergonomic", "Escalator", "Eureka", "Europe", "Evolution", "Extension", "Eyebrow", "Fan", "Fancy", "Fast", "Feast", "Fence", "Feudalism", "Fiddle", "Figment", "Finger", "Fire", "First", "Fishing", "Fix", "Fizz", "Flagpole", "Flannel", "Flashlight", "Flock", "Flotsam", "Flower", "Flu", "Flush", "Flutter", "Fog", "Foil", "Football", "Forehead", "Forever", "Fortnight", "France", "Freckle", "Freight", "Fringe", "Frog", "Frown", "Gallop", "Game", "Garbage", "Garden", "Gasoline", "Gem", "Ginger", "Gingerbread", "Girl", "Glasses", "Goblin", "Gold", "Goodbye", "Grandpa", "Grape", "Grass", "Gratitude", "Gray", "Green", "Guitar", "Gum", "Gumball", "Hair", "Half", "Handle", "Handwriting", "Hang", "Happy", "Hat", "Hatch", "Headache", "Heart", "Hedge", "Helicopter", "Hem", "Hide", "Hill", "Hockey", "Homework", "Honk", "Hopscotch", "Horse", "Hose", "Hot", "House", "Houseboat", "Hug", "Humidifier", "Hungry", "Hurdle", "Hurt", "Hut", "Ice", "Implode", "Inn", "Inquisition", "Intern", "Internet", "Invitation", "Ironic", "Ivory", "Ivy", "Jade", "Japan", "Jeans", "Jelly", "Jet", "Jig", "Jog", "Journal", "Jump", "Key", "Killer", "Kilogram", "King", "Kitchen", "Kite", "Knee", "Kneel", "Knife", "Knight", "Koala", "Lace", "Ladder", "Ladybug", "Lag", "Landfill", "Lap", "Laugh", "Laundry", "Law", "Lawn", "Lawnmower", "Leak", "Leg", "Letter", "Level", "Lifestyle", "Ligament", "Light", "Lightsaber", "Lime", "Lion", "Lizard", "Log", "Loiterer", "Lollipop", "Loveseat", "Loyalty", "Lunch", "Lunchbox", "Lyrics", "Machine", "Macho", "Mailbox", "Mammoth", "Mark", "Mars", "Mascot", "Mast", "Matchstick", "Mate", "Mattress", "Mess", "Mexico", "Midsummer", "Mine", "Mistake", "Modern", "Mold", "Mom", "Monday", "Money", "Monitor", "Monster", "Mooch", "Moon", "Mop", "Moth", "Motorcycle", "Mountain", "Mouse", "Mower", "Mud", "Music", "Mute", "Nature", "Negotiate", "Neighbor", "Nest", "Neutron", "Niece", "Night", "Nightmare", "Nose", "Oar", "Observatory", "Office", "Oil", "Old", "Olympian", "Opaque", "Opener", "Orbit", "Organ", "Organize", "Outer", "Outside", "Ovation", "Overture", "Pail", "Paint", "Pajamas", "Palace", "Pants", "Paper", "Paper", "Park", "Parody", "Party", "Password", "Pastry", "Pawn", "Pear", "Pen", "Pencil", "Pendulum", "Penis", "Penny", "Pepper", "Personal", "Philosopher", "Phone", "Photograph", "Piano", "Picnic", "Pigpen", "Pillow", "Pilot", "Pinch", "Ping", "Pinwheel", "Pirate", "Plaid", "Plan", "Plank", "Plate", "Platypus", "Playground", "Plow", "Plumber", "Pocket", "Poem", "Point", "Pole", "Pomp", "Pong", "Pool", "Popsicle", "Population", "Portfolio", "Positive", "Post", "Princess", "Procrastinate", "Protestant", "Psychologist", "Publisher", "Punk", "Puppet", "Puppy", "Push", "Puzzle", "Quarantine", "Queen", "Quicksand", "Quiet", "Race", "Radio", "Raft", "Rag", "Rainbow", "Rainwater", "Random", "Ray", "Recycle", "Red", "Regret", "Reimbursement", "Retaliate", "Rib", "Riddle", "Rim", "Rink", "Roller", "Room", "Rose", "Round", "Roundabout", "Rung", "Runt", "Rut", "Sad", "Safe", "Salmon", "Salt", "Sandbox", "Sandcastle", "Sandwich", "Sash", "Satellite", "Scar", "Scared", "School", "Scoundrel", "Scramble", "Scuff", "Seashell", "Season", "Sentence", "Sequins", "Set", "Shaft", "Shallow", "Shampoo", "Shark", "Sheep", "Sheets", "Sheriff", "Shipwreck", "Shirt", "Shoelace", "Short", "Shower", "Shrink", "Sick", "Siesta", "Silhouette", "Singer", "Sip", "Skate", "Skating", "Ski", "Slam", "Sleep", "Sling", "Slow", "Slump", "Smith", "Sneeze", "Snow", "Snuggle", "Song", "Space", "Spare", "Speakers", "Spider", "Spit", "Sponge", "Spool", "Spoon", "Spring", "Sprinkler", "Spy", "Square", "Squint", "Stairs", "Standing", "Star", "State", "Stick", "Stockholder", "Stoplight", "Stout", "Stove", "Stowaway", "Straw", "Stream", "Streamline", "Stripe", "Student", "Sun", "Sunburn", "Sushi", "Swamp", "Swarm", "Sweater", "Swimming", "Swing", "Tachometer", "Talk", "Taxi", "Teacher", "Teapot", "Teenager", "Telephone", "Ten", "Tennis", "Thief", "Think", "Throne", "Through", "Thunder", "Tide", "Tiger", "Time", "Tinting", "Tiptoe", "Tiptop", "Tired", "Tissue", "Toast", "Toilet", "Tool", "Toothbrush", "Tornado", "Tournament", "Tractor", "Train", "Trash", "Treasure", "Tree", "Triangle", "Trip", "Truck", "Tub", "Tuba", "Tutor", "Television", "Twang", "Twig", "Twitterpated", "Type", "Unemployed", "Upgrade", "Vest", "Vision", "Wag", "Water", "Watermelon", "Wax", "Wedding", "Weed", "Welder", "Whatever", "Wheelchair", "Whiplash", "Whisk", "Whistle", "White", "Wig", "Will", "Windmill", "Winter", "Wish", "Wolf", "Wool", "World", "Worm", "Wristwatch", "Yardstick", "Zamboni", "Zen", "Zero", "Zipper", "Zone", "Zoo"]

class CodenamesGame():
    def __init__(self):
        self.board = self.initiate_board()
        self.openai_thread = initialize_game_thread()
        self.red_spymaster = None
        self.blue_spymaster = None
        self.red_operatives = []
        self.blue_operatives = []
        self.red_guesses = []
        self.blue_guesses = []
        self.red_score = 0
        self.blue_score = 0
        self.red_turn = True
        self.winner = None
        
    def set_red_spymaster(self, spymaster):
        self.red_spymaster = spymaster
        
    def set_blue_spymaster(self, spymaster):
        self.blue_spymaster = spymaster
        
    def set_red_operatives(self, operatives):
        self.red_operatives = operatives
        
    def set_blue_operatives(self, operatives):
        self.blue_operatives = operatives
        
    def set_red_guesses(self, guesses):
        self.red_guesses = guesses
        
    def set_blue_guesses(self, guesses):
        self.blue_guesses = guesses
        
    def set_red_score(self, score):
        self.red_score = score
        
    def set_blue_score(self, score):
        self.blue_score = score
        
    def set_current_turn(self, turn):
        self.current_turn = turn
        
    def set_winner(self, winner):
        self.winner = winner
        
    def get_red_spymaster(self):
        return self.red_spymaster
    
    def get_blue_spymaster(self):
        return self.blue_spymaster
    
    def get_red_operatives(self):
        return self.red_operatives
    
    def get_blue_operatives(self):
        return self.blue_operatives
    
    def get_red_guesses(self):
        return self.red_guesses
    
    def get_blue_guesses(self):
        return self.blue_guesses
    
    def get_red_score(self):
        return self.red_score
    
    def get_blue_score(self):
        return self.blue_score
    
    def get_current_turn(self):
        return self.current_turn
    
    def get_winner(self):
        return self.winner
    
    def get_board(self):
        return self.board
    
    def get_openai_thread(self):
        return self.openai_thread
        
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
                self.red_turn = True
                if self.red_score == 9:
                    self.winner = "red"
            case CardType.BLUE_AGENT:
                print("Blue agent!\n")
                self.blue_score += 1
                self.red_turn = False
                if self.blue_score == 8:
                    self.winner = "blue"
            case CardType.BYSTANDER:
                print("Bystander!\n")
                self.red_turn = not self.red_turn
            case CardType.ASSASSIN:
                print("Assassin!\n")
                self.winner = "blue" if self.red_turn else "red"
                
    def end_turn(self):
        self.red_turn = not self.red_turn

    def initiate_board(self) -> List[Card]:
        # pick 25 random words from the word list
        # being lazy and just making it a set, so we don't have to worry about duplicates
        selected_words = set()
        deck = set()
        while len(selected_words) < 25:
            selected_words.add(random.choice(WORD_LIST))
            

        # assign 9 words to be red agents
        for _ in range(9):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.RED_AGENT))
        # assign 8 words to be blue agents
        for _ in range(8):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.BLUE_AGENT))
        # assign 7 words to be bystanders
        for _ in range(7):
            deck.add(Card(word_value=selected_words.pop(), type_value=CardType.BYSTANDER))
        # assign 1 word to be the assassin
        deck.add(Card(word_value=selected_words.pop(), type_value=CardType.ASSASSIN))
        
        # assign each random card a position
        # todo(arb) - this is not random enough
        final_board = []
        for i in range(5):
            for j in range(5):
                random_card = deck.pop()
                random_card.position = Position(x=i, y=j)
                final_board.append(random_card)
        # return the board
        # board_string = "\n".join([str(card) for card in final_board])
        # print(board_string)
        return final_board


if __name__ == "__main__":
    game = CodenamesGame()
    game.red_spymaster = initialize_ai_spymaster("red")
    game.blue_spymaster = initialize_ai_spymaster("blue")
    prev_turn = not game.red_turn
    while True:
        board_string = "\n".join([str(card) for card in game.board])
        print(board_string + "\n")
        # If the turn has changed, we need a new clue:
        if prev_turn != game.red_turn:
            if game.red_turn:
                print("Red turn:\n")
                print(get_spymaster_clue(game.board, game.openai_thread.id, game.red_spymaster.id)[0].text.value)
            else:
                print("Blue turn\n")
                print(get_spymaster_clue(game.board, game.openai_thread.id, game.blue_spymaster.id)[0].text.value)

        prev_turn = game.red_turn
        choice = input("Enter a position to guess (format: x,y), or 'next' to end turn:\n")
        if choice == "next":
            game.end_turn()
            print(f"Current turn: {'red' if game.red_turn else 'blue'}\n")
            continue
        guess_position = Position(int(choice.split(",")[0]), int(choice.split(",")[1]))
        game.reveal_card(guess_position)
        if game.winner:
            print(f"{game.winner} wins!")
            break
    # game.reveal_card(Position(x=0, y=0))
    # board_string = "\n".join([str(card) for card in game.board])
    # print(board_string)
    # print(game.red_turn)
    # print(game.board)
    # get initial clue from red spymaster
    # have a way for user to guess (reveal_card, this will update the board)
    # if the turn has not changed (ie, was red, still red), can either guess or end turn
    # if the turn has changed, send guesses to the thread, and ping the other spymaster for a clue
    # repeat until game is over