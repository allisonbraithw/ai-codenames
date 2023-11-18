import graphene
from typing import List
from graphene_federation import build_schema

from codenames.game.game import CodenamesGame

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
    winner = graphene.Field(Team)

class GuessCard(graphene.Mutation):
    class Arguments:
        position = PositionInput(required=True)
    
    # todo(arb) error handling
    ok = graphene.Boolean()
    
    def mutate(self, info, position):
        game = CodenamesGame.get_game()
        game.reveal_card(position)
        
        return GuessCard(ok=True)
    
class InitializeGame(graphene.Mutation):
    game = graphene.Field(Game)
    
    def mutate(self, info):
        game = CodenamesGame.new_game()
        game.generate_clue()
        
        return InitializeGame(game=Game(board=game.board, turn={True: Team.RED, False: Team.BLUE}[game.red_turn], current_clue=game.get_current_clue(), turn_count=game.turn_count))
    
class EndTurn(graphene.Mutation):
    ok = graphene.Boolean()
    
    def mutate(self, info):
        game = CodenamesGame.get_game()
        game.end_turn()
        
        return EndTurn(ok=True)

class Mutation(graphene.ObjectType):
    guess_card = GuessCard.Field()
    initialize_game = InitializeGame.Field()
    end_turn = EndTurn.Field()
    
class Query(graphene.ObjectType):
    card = graphene.Field(Card, position=graphene.NonNull(PositionInput))
    game = graphene.Field(Game)
    
    def resolve_game(self, info):
        game = CodenamesGame.get_game()
        board = game.board
        red_turn = game.red_turn
        current_clue = game.get_current_clue()
        turn_count = game.turn_count
        return Game(
            board=board, 
            turn={True: Team.RED, False: Team.BLUE}[red_turn], 
            current_clue=current_clue,
            turn_count=turn_count,
            winner= Team.RED if game.winner == "red" else Team.BLUE if game.winner == "blue" else None
            )

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