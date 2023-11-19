import { useState, useEffect } from 'react'
import { 
  SimpleGrid, 
  Box, 
  Spacer, 
  Flex,
  Text, 
  Button, 
  Card as ChakraCard, 
  CardBody,
  CardHeader,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Stack,
  StackDivider
 } from '@chakra-ui/react'
import { graphql } from "../src/gql"
import { Card, Position, Team, Clue } from '../src/gql/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import './App.css'

const getBoardQueryDocument = graphql(`
  query GetBoardQueryDocument {
    game {
      board {
        wordValue
        typeValue
        isRevealed
        position {
          x
          y
        }
      }
      turn
      turnCount
      currentClue {
        word
        number
      }
      winner
    }
  }
`)

const getGameRecapQueryDocument = graphql(`
  query GetGameRecapQueryDocument {
    game {
      redClues {
        word
        number
        reasoning
      }
      blueClues {
        word
        number
        reasoning
      }
    }
  }
`)

const initializeGameMutationDocument = graphql(`
  mutation InitializeGameMutationDocument {
    initializeGame {
      game {
        board {
          wordValue
          typeValue
          isRevealed
          position {
            x
            y
          }
        }
        turn
        turnCount
        winner
        currentClue {
          word
          number
        }
      }
    }
  }
`)

const guessCardMutationDocument = graphql(`
  mutation GuessCardMutationDocument($position: PositionInput!) {
    guessCard(position: $position) {
      ok
    }
  }
`)

const endTurnMutationDocument = graphql(`
  mutation EndTurnMutationDocument {
    endTurn {
      ok
    }
  }
`)

const endGameMutationDocument = graphql(`
  mutation EndGameMutationDocument {
    endGame {
      ok
    }
  }
`)

function App() {
  const [ board, setBoard ] = useState<Array<Card>>([])
  const [ turn, setTurn ] = useState<Team>(Team.Red)
  const [ turnCount, setTurnCount ] = useState<number>(0)
  const [ clue, setClue ] = useState<Clue>()
  const [ winner, setWinner ] = useState<Team>()
  const [ redClues, setRedClues ] = useState<Array<Clue>>([])
  const [ blueClues, setBlueClues ] = useState<Array<Clue>>([])
  const [ generateBoard ] = useMutation(initializeGameMutationDocument)
  const [ endTurn ] = useMutation(endTurnMutationDocument)
  const [ endGame ] = useMutation(endGameMutationDocument)
  const [ getGameRecap ] = useLazyQuery(getGameRecapQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        console.log(data)
        setRedClues(data.game.redClues!.filter((clue): clue is Clue => clue !== null))
        setBlueClues(data.game.blueClues!.filter((clue): clue is Clue => clue !== null))
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ loadBoard ] = useLazyQuery(getBoardQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        console.log(data)
        setBoard(data.game.board!.filter((card): card is Card => card !== null))
        setTurn(data.game.turn!)
        setTurnCount(data.game.turnCount!)
        setClue(data.game.currentClue!)
        setWinner(data.game.winner!)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ guessCard ] = useMutation(guessCardMutationDocument)
  const handleLoadBoard = () => {
    generateBoard({
      onCompleted: (data) => {
        if (data.initializeGame != null) {
          console.log(data)
          setBoard(data.initializeGame.game!.board!.filter((card): card is Card => card !== null))
          setTurn(data.initializeGame.game!.turn!)
          setTurnCount(data.initializeGame.game!.turnCount!)
          setClue(data.initializeGame.game!.currentClue!)
          setWinner(data.initializeGame.game!.winner!)
        }
      }
    })
  }

  // use effect to load the recap when winner changes
  useEffect(() => {
    if (winner != null) {
      getGameRecap()
    }
  }, [winner, getGameRecap])

  const handleGuessCard = async (position: Position) => {
    try {
      await guessCard({ variables: { "position": {
        x: position.x,
        y: position.y
      } } })
      loadBoard()
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndTurn = async () => {
    try {
      await endTurn()
      loadBoard()
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndGame = async () => { 
    try {
      await endGame()
      loadBoard()
    } catch (e) {
      console.log(e)
    }
  }

  const renderCard = (card: Card) => {
    const color = card.isRevealed ? getColorBasedOnType(card.typeValue!) : "#E2E8F0"
    return (
      <Box
        bg={color}
        width="200px" 
        height="100px" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        key={`${card?.position?.x}-${card?.position?.y}`}
        onClick={() => handleGuessCard(card!.position!)}
        >
          <Flex direction="column">
            <Text>{card?.wordValue}</Text>
          </Flex>
      </Box>
    )
  }

  const renderClues = (clues: Array<Clue>) => {
    return (
      <Flex direction="column">
        <Stack divider={<StackDivider />} spacing={3}>
        {clues.map((clue) => (
          <Flex direction="column" key={`${clue.word}-${clue.number}`}>
            <Box>
              <Heading size='xs' textTransform='uppercase'>{clue.word}</Heading>
              <Text>{clue.reasoning}</Text>
            </Box>
          </Flex>
        ))}
        </Stack>
      </Flex>
    )
  }


  return (
    <>
      <h1>CodenamesAI</h1>
      <Spacer p={5}/>
      <Modal isOpen={winner != null} onClose={handleLoadBoard} size='xl'>
        <ModalOverlay />  
        <ModalContent>
          <ModalHeader>Winner: {winner}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <ChakraCard bg="#FEB2B2">
                <CardBody>{renderClues(redClues)}</CardBody>
              </ChakraCard>
              <Spacer p={5}/>
              <ChakraCard bg="#BEE3F8">
                <CardBody>{renderClues(blueClues)}</CardBody>
              </ChakraCard>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleLoadBoard}>Play Again</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      { board.length == 0 ?    
      <Button onClick={handleLoadBoard}>Get Board</Button> :
      <Flex direction="column">
        <ChakraCard>
          <CardBody bg={turn == Team.Red ? "#FEB2B2" : "#BEE3F8"}>
            <Flex>
              <Text>Clue: {clue!.word}, {clue!.number}</Text>
              <Spacer />
              <Flex gap={3}>
                <Text>Guesses Remaining: {turnCount}</Text>
                <Button onClick={handleEndTurn} size="xs">End Turn</Button>
                <Button onClick={handleEndGame} size="xs">End Game</Button>
              </Flex>
            </Flex>
          </CardBody>
        </ChakraCard>
        <Spacer p={5}/>
        <SimpleGrid columns={5} spacing={10}>
          {board.map((card) => (
              renderCard(card)
          )
          )}
        </SimpleGrid>
      </Flex>}
    </>
  )
}

const getColorBasedOnType = (type: string) => {
  switch (type) {
    case "RED_AGENT":
      return "#FEB2B2"
    case "BLUE_AGENT":
      return "#BEE3F8"
    case "ASSASSIN":
      return "black"
    case "BYSTANDER":
      return "#FEEBC8"
    default:
      return "#CBD5E0"
  }
}

export default App
