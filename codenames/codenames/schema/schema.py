from graphene import ObjectType, Field, String
from graphene_federation import build_schema

class TestObject(ObjectType):
    test_field = String()

class Query(ObjectType):
    test_object = Field(TestObject)
    
    def resolve_test_object(self, info):
        return TestObject(test_field="test")

schema = build_schema(query=Query)

if __name__ == "__main__":
    from graphql import graphql
    result = graphql(schema, '{ _service { sdl } }')
    print(result.data["_service"]["sdl"].strip())