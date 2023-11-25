import graphene
import time
import json
from typing import List
from graphene_federation import build_schema

from game.game import CodenamesGame
from dependency_factory import dependency_factory as df

redis_client = df.redis_client

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
        game = CodenamesGame.get_game()
        return {True: Team.RED, False: Team.BLUE}[game.red_turn]
    
    def resolve_turn_count(parent, info):
        return parent.turn_count
    
    def resolve_current_clue(parent, info):
        game = CodenamesGame.get_game()
        return game.get_current_clue()
    
    def resolve_red_clues(parent, info):
        return parent.red_clues
    
    def resolve_blue_clues(parent, info):
        return parent.blue_clues
    
    def resolve_winner(parent, info):
        game = CodenamesGame.get_game()
        return Team.RED if game.winner == "red" else Team.BLUE if game.winner == "blue" else None


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

class GuessCard(graphene.Mutation):
    class Arguments:
        position = PositionInput(required=True)
    
    # todo(arb) error handling
    ok = graphene.Boolean()
    
    def mutate(self, info, position):
        game = CodenamesGame.get_game()
        game.reveal_card(position)
        
        return GuessCard(ok=True)
  
class StartRoom(graphene.Mutation):
    room = graphene.Field(Room)
    
    def mutate(self, info):
        # generate ID
        room = Room(id="1", name=f"test-{time.time()}", game=CodenamesGame.new_game())
        # put into upstash redis
        redis_client.set("1", json.dumps(room.game.to_serializable()))
        return StartRoom(room=room)
    
class InitializeGame(graphene.Mutation):
    game = graphene.Field(Game)
    
    def mutate(self, info):
        game = CodenamesGame.new_game()
        
        return InitializeGame(game=Game(board=game.board, turn={True: Team.RED, False: Team.BLUE}[game.red_turn], turn_count=game.turn_count))
    
class EndTurn(graphene.Mutation):
    ok = graphene.Boolean()
    
    def mutate(self, info):
        game = CodenamesGame.get_game()
        game.end_turn()
        
        return EndTurn(ok=True)
    
class EndGame(graphene.Mutation):
    ok = graphene.Boolean()
    
    def mutate(self, info):
        game = CodenamesGame.get_game()
        game.end_game()
        
        return EndGame(ok=True)
    
class GenerateClue(graphene.Mutation):
    # clue = graphene.Field(Clue)
    ok = graphene.Boolean()
    
    def mutate(self, info):
        game = CodenamesGame.get_game()
        game.generate_clue()
        
        return GenerateClue(ok=True)

class Mutation(graphene.ObjectType):
    guess_card = GuessCard.Field()
    initialize_game = InitializeGame.Field()
    end_turn = EndTurn.Field()
    end_game = EndGame.Field()
    generate_clue = GenerateClue.Field()
    start_room = StartRoom.Field()
    
class Query(graphene.ObjectType):
    card = graphene.Field(Card, position=graphene.NonNull(PositionInput))
    game = graphene.Field(Game, room_id=graphene.NonNull(graphene.ID))
    
    def resolve_game(self, info, room_id):
        # game = CodenamesGame.get_game()
        game_json = json.loads(redis_client.get(room_id))
        return CodenamesGame.from_dict(game_json)

schema = build_schema(query=Query, mutation=Mutation)

# Helpers
def user_guesses(board: List[Card], guess: Card) -> CardType:
    """Given a board and a guess, return the type of the card"""
    for card in board:
        if card.position == guess.position:
            return card.type_value
    raise Exception("Card not found in board")

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())