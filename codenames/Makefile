.PHONY: generate
generate: schema.graphql

schema.graphql: codenames/schema/schema.py
	poetry run python codenames/schema/schema.py > schema.graphql

run: 
	poetry run python codenames/main.py --reload

play-cli:
	poetry run python codenames/game/game.py