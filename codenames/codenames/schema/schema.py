from graphene import ObjectType, Field, String, Boolean, Int
from graphene_federation import build_schema
from enum import Enum

# Define card type enum
class CardType(Enum):
    RED_AGENT = "red_agent"
    BLUE_AGENT = "blue_agent"
    BYSTANDER = "bystander"
    ASSASSIN = "assassin"
    
class Position(ObjectType):
    x = Int()
    y = Int()

class Card(ObjectType):
    word_value = String()
    type_value = CardType()
    position = Field(Position)
    is_revealed = Boolean()

class Query(ObjectType):
    card = Field(Card, position=Position(required=True))


schema = build_schema(query=Query)

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())