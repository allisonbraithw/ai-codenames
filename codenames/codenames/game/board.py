from enum import Enum

class CardType(Enum):
    RED_AGENT = 1
    BLUE_AGENT = 2
    BYSTANDER = 3
    ASSASSIN = 4

    def __str__(self):
        return self.name.replace('_', ' ').title()
    
class Position():
    x: int
    y: int
    
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"({self.x}, {self.y})"
    

class Card():
    word_value: str
    type_value : CardType
    position: Position
    is_revealed: bool = False
    
    def __init__(self, word_value: str, type_value: CardType, position: Position, is_revealed: bool = False):
        self.word_value = word_value
        self.type_value = type_value
        self.position = position
        self.is_revealed = is_revealed
    
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
    
    def to_serializable(self):
        return {"word_value": self.word_value, "type_value": self.type_value.name, "position": {"x": self.position.x, "y": self.position.y}, "is_revealed": self.is_revealed}
    
    @classmethod
    def from_dict(cls, card_dict: dict):
        return cls(card_dict["word_value"], CardType[card_dict["type_value"]], Position(card_dict["position"]["x"], card_dict["position"]["y"]), card_dict["is_revealed"])
        
class Clue():
    word: str
    number: int
    reasoning: str
    
    def __init__(self, word: str, number: int, reasoning: str):
        self.word = word
        self.number = number
        self.reasoning = reasoning
        
    def __str__(self):
        return f"Clue: {self.word}, {self.number}, {self.reasoning}"
    
    def to_serializable(self):
        return {"word": self.word, "number": self.number, "reasoning": self.reasoning}
    
    @classmethod
    def from_dict(cls, clue_dict: dict):
        return cls(clue_dict["word"], clue_dict["number"], clue_dict["reasoning"])