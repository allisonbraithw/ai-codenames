.PHONY: generate
generate: schema.graphql

schema.graphql: codenames/schema/schema.py
	PYTHONPATH=/Users/allisonbraithwaite/Projects/ai-codenames/codenames/codenames poetry run python codenames/schema/schema.py > schema.graphql

run: 
	poetry run python codenames/main.py --reload

play-cli:
	poetry run python codenames/game/game.py

.PHONY: requirements.txt
requirements.txt:
	poetry export -f requirements.txt --output requirements.txt --without-hashes