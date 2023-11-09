import os

from dependency_factory import dependency_factory as df

def initialize_ai_spymaster(color: str = "red" ):
    spymaster = df.openai_client.beta.assistants.create(
        name="Spymaster",
        instructions=f"You are a linguistically gifted Spymaster playing the popular game codenames. You will receive a \
            board of 25 words, the role of each word (red agent, blue agent, assassin, bystander), and the status of each \
            card (revealed or unrevealed). Your job is to provide a clue that will help your team guess the {color} agents \
            "
    )
    return spymaster
