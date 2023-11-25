import graphene
import time
import json
import random
from typing import List
from graphene_federation import build_schema

from game.game import CodenamesGame
from dependency_factory import dependency_factory as df

redis_client = df.redis_client

# region ObjectTypes

# Define card type enum
class CardType(graphene.Enum):
    RED_AGENT = 1
    BLUE_AGENT = 2
    BYSTANDER = 3
    ASSASSIN = 4

    def __str__(self):
        return self.name.replace('_', ' ').title()
    
class Team(graphene.Enum):
    RED = 1
    BLUE = 2
    
    def __str__(self):
        return self.name.replace('_', ' ').title()
    
class Position(graphene.ObjectType):
    x = graphene.Int()
    y = graphene.Int()
    
    def __str__(self):
        return f"({self.x}, {self.y})"
    
class PositionInput(graphene.InputObjectType):
    x = graphene.Int()
    y = graphene.Int()
    
    def __str__(self):
        return f"({self.x}, {self.y})"

class Card(graphene.ObjectType):
    word_value = graphene.String()
    type_value = graphene.Field(CardType)
    position = graphene.Field(Position)
    is_revealed = graphene.Boolean(default_value=False)
    
    # Print a string that contains all the relevant information about the card
    # if the card is revealed, includes the type, else does not
    def __str__(self):
        if self.is_revealed:
            return f"Card: {self.word_value}, {str(self.type_value)}, {str(self.position)}"
        else:
            return f"Card: {self.word_value}, {str(self.position)}"
      
    # Returns the full representation of the card, with all information, whether it is revealed or not
    def __repr__(self):
        return f"Card: {self.word_value}, {str(self.type_value)}, {str(self.position)}, {self.is_revealed}"
        
class Clue(graphene.ObjectType):
    word = graphene.String()
    number = graphene.Int()
    reasoning = graphene.String()
        
    def __str__(self):
        return f"Clue: {self.word}, {self.number}, {self.reasoning}"
        
class Game(graphene.ObjectType):
    board = graphene.List(Card)
    turn = graphene.Field(Team)
    turn_count = graphene.Int()
    current_clue = graphene.Field(Clue)
    red_clues = graphene.List(Clue)
    blue_clues = graphene.List(Clue)
    winner = graphene.Field(Team)
    
    def resolve_board(parent, info):
        return parent.board
    
    def resolve_turn(parent, info):
        return {True: Team.RED, False: Team.BLUE}[parent.red_turn]
    
    def resolve_turn_count(parent, info):
        return parent.turn_count
    
    def resolve_current_clue(parent, info):
        return parent.get_current_clue()
    
    def resolve_red_clues(parent, info):
        return parent.red_clues
    
    def resolve_blue_clues(parent, info):
        return parent.blue_clues
    
    def resolve_winner(parent, info):
        return Team.RED if parent.winner == "red" else Team.BLUE if parent.winner == "blue" else None

class Room(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    game = graphene.Field(Game)
    
    def resolve_game(parent, info):
        return parent.game
    
    def resolve_name(parent, info):
        return parent.name
    
    def resolve_id(parent, info):
        return parent.id

# endregion

# region Mutations
class GuessCard(graphene.Mutation):
    class Arguments:
        position = PositionInput(required=True)
        room_id = graphene.NonNull(graphene.ID)
    
    # todo(arb) error handling
    ok = graphene.Boolean()
    
    def mutate(self, info, position, room_id):
        game = load_from_redis(room_id)
        game.reveal_card(position)
        redis_client.set(room_id, json.dumps(game.to_serializable()))
        
        return GuessCard(ok=True)
  
class StartRoom(graphene.Mutation):
    room = graphene.Field(Room)
    
    def mutate(self, info):
        # generate ID
        room_id = generate_room_id()
        room = Room(id=room_id, name=f"test-{time.time()}", game=CodenamesGame.new_game())
        # put into upstash redis
        redis_client.set(room_id, json.dumps(room.game.to_serializable()))
        return StartRoom(room=room)
    
class EndTurn(graphene.Mutation):
    class Arguments:
        room_id = graphene.NonNull(graphene.ID)
    ok = graphene.Boolean()
    
    def mutate(self, info, room_id):
        game = load_from_redis(room_id)
        game.end_turn()
        redis_client.set(room_id, json.dumps(game.to_serializable()))
        
        return EndTurn(ok=True)
    
class EndGame(graphene.Mutation):
    class Arguments:
        room_id = graphene.NonNull(graphene.ID)
        
    ok = graphene.Boolean()
    
    def mutate(self, info, room_id):
        game = load_from_redis(room_id)
        game.end_game()
        redis_client.set(room_id, json.dumps(game.to_serializable()))
        
        return EndGame(ok=True)
    
class GenerateClue(graphene.Mutation):
    class Arguments:
        room_id = graphene.NonNull(graphene.ID)
        
    ok = graphene.Boolean()
    
    def mutate(self, info, room_id):
        game = load_from_redis(room_id)
        game.generate_clue()
        redis_client.set(room_id, json.dumps(game.to_serializable()))
        
        return GenerateClue(ok=True)

# endregion

class Mutation(graphene.ObjectType):
    guess_card = GuessCard.Field()
    end_turn = EndTurn.Field()
    end_game = EndGame.Field()
    generate_clue = GenerateClue.Field()
    start_room = StartRoom.Field()
    
class Query(graphene.ObjectType):
    card = graphene.Field(Card, position=graphene.NonNull(PositionInput))
    game = graphene.Field(Game, room_id=graphene.NonNull(graphene.ID))
    
    def resolve_game(self, info, room_id):
        return load_from_redis(room_id)

schema = build_schema(query=Query, mutation=Mutation)

# region Helpers
def user_guesses(board: List[Card], guess: Card) -> CardType:
    """Given a board and a guess, return the type of the card"""
    for card in board:
        if card.position == guess.position:
            return card.type_value
    raise Exception("Card not found in board")
  
def load_from_redis(room_id: str):
    game_json = json.loads(redis_client.get(room_id))
    return CodenamesGame.from_dict(game_json)

adjectives = ["happy", "jolly", "bright", "clever", "quick"]
nouns = ["eagle", "panther", "lion", "tiger", "shark"]

def generate_room_id():
    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    return f"{adjective}_{noun}"
    
# endregion

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())