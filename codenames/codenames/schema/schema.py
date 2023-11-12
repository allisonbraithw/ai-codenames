from graphene import ObjectType, Field, String, Boolean, Int, List, NonNull, Enum, InputObjectType
from graphene_federation import build_schema

# Define card type enum
class CardType(Enum):
    RED_AGENT = 1
    BLUE_AGENT = 2
    BYSTANDER = 3
    ASSASSIN = 4
    
class Position(ObjectType):
    x = Int()
    y = Int()
    
    def __str__(self):
        return f"({self.x}, {self.y})"
    
class PositionInput(InputObjectType):
    x = Int()
    y = Int()
    
    def __str__(self):
        return f"({self.x}, {self.y})"

class Card(ObjectType):
    word_value = String()
    type_value = Field(CardType)
    position = Field(Position)
    is_revealed = Boolean(default_value=False)
    
    # Print a string that contains all the relevant information about the card
    def __str__(self):
        return f"Card: {self.word_value}, {self.type_value}, {str(self.position)}, {self.is_revealed}"
        
    
    

class Query(ObjectType):
    card = Field(Card, position=NonNull(PositionInput))
    board = List(Card)


schema = build_schema(query=Query)

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())