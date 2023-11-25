import json
from time import sleep
from dotenv import load_dotenv
from typing import List


# from codenames.game.board import initiate_board
from game.board import Card, Clue
from dependency_factory import dependency_factory as df

load_dotenv()

client = df.openai_client

def initialize_ai_spymaster(color: str = "red" ):
    spymaster = client.beta.assistants.create(
        name="Spymaster",
        model="gpt-4-1106-preview",
        instructions=f"You are a linguistically gifted Spymaster playing the popular game codenames. You will receive a \
            board of 25 words, the role of each word (red agent, blue agent, assassin, bystander), and the status of each \
            card (revealed or unrevealed). Your job is to provide a clue that will help your team guess the {color} agents. \
            You are the spymaster in the game, and thus you should return a clue following the rules, ie, is a single word, and a \
            number indicating the number of cards related to the clue. \
            The cards will be provided as a list of strings, formatted as follows: \
               Card: word, type, position, is_revealed. The type is one of: red_agent, blue_agent, assassin, bystander. \
            Remember to follow these guidelines when providing your clue: \
                1. Your clue should help your team {color} guess the {color} agents. \
                2. Your could should NOT plausibly refer to any of the other cards on the board. \
                    a. In order of priority, meaning MUST avoid the assassin, then the other team's agents. Bystanders may be a strategic risk \
            Consider the associations your operatives are most likely to make-- just because a connection can be made doesn't mean it's the most \
            guessable one. \
            You should return your response json formatted as follows: \
                {{\"word\": \"clue\", \"number\": 1, \"reasouning\": \"<your reasoning here>\"}} \
            do not include ANY additional characters outside of the json, including delimiters or the word json \
            "
    )
    return spymaster

def initialize_game_thread():
    return client.beta.threads.create()

def get_spymaster_clue(board: List[Card], thread_id: str, spymaster_id: str) -> str:
    """Given a board and a color, return a clue"""
    board_string = "\n".join([repr(card) for card in board])
    client.beta.threads.messages.create(thread_id, role="user", content=f"Here are the cards in the board: {board_string}. Return a clue for the remaining cards of your team's color")
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=spymaster_id,
    )
    messages = retrieve_messages(thread_id, run.id)
    clue = messages.data[0].content[0].text.value
    try:
        json_clue = json.loads(clue)
    except json.JSONDecodeError:
        print(clue)
        raise Exception("Clue not returned in json format")
    # return the clue as a Clue object
    return Clue(word=json_clue["word"], number=int(json_clue["number"]), reasoning=json_clue["reasoning"])
    
    

def retrieve_messages(thread_id: str, run_id: str):
    while True:
        sleep(1)
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        if run.status == "completed":
            break
    return client.beta.threads.messages.list(thread_id=thread_id)

# if __name__ == "__main__":
    # board = initiate_board()
    # board_string = "\n".join([str(card) for card in board])
    # spymaster = initialize_ai_spymaster("red")
    # thread = client.beta.threads.create()
    # client.beta.threads.messages.create(thread.id, role="user", content=f"Here are the cards in the board: {board_string}. Return the first clue")
    # run = client.beta.threads.runs.create(
    #     thread_id=thread.id,
    #     assistant_id=spymaster.id,
    # )
    # while True:
    #     sleep(1)
    #     run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
    #     print(run.status)
    #     if run.status == "completed":
    #         break
        
    # print(client.beta.threads.messages.list(thread_id=thread.id).data[0].content)
    