import os
from time import sleep
from dotenv import load_dotenv


# from codenames.game.board import initiate_board
from codenames.dependency_factory import dependency_factory as df

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
            number indicating the number of cards related to the clue. Do not explain your reasoning. \
            "
    )
    return spymaster

def initialize_game_thread():
    return client.beta.threads.create()

def retrieve_messages(thread_id: str, run_id: str):
    while True:
        sleep(1)
        message = client.beta.threads.messages.retrieve(thread_id=thread_id, run_id=run_id)
        if message.status == "completed":
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
    