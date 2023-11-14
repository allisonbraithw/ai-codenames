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
    text = graphene.String()
    number = graphene.Int()
    reasoning = graphene.String()
        
    def __str__(self):
        return f"Clue: {self.text}, {self.number}, {self.reasoning}"
        

class GuessCard(graphene.Mutation):
    class Arguments:
        position = PositionInput(required=True)
    
    # todo(arb) error handling
    ok = graphene.Boolean()
    
    def mutate(self, info, position):
        game = CodenamesGame.get_game()
        game.reveal_card(position)
        
        return GuessCard(ok=True)

class Mutation(graphene.ObjectType):
    guess_card = GuessCard.Field()
    
class Query(graphene.ObjectType):
    card = graphene.Field(Card, position=graphene.NonNull(PositionInput))
    board = graphene.List(Card)
    
    def resolve_board(self, info):
        game = CodenamesGame.get_game()
        return game.board


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