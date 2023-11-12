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
    
class PositionInput(InputObjectType):
    x = Int()
    y = Int()

class Card(ObjectType):
    word_value = String()
    type_value = Field(CardType)
    position = Field(Position)
    is_revealed = Boolean()

class Query(ObjectType):
    card = Field(Card, position=NonNull(PositionInput))
    board = List(Card)


schema = build_schema(query=Query)

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())