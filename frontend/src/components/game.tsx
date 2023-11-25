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
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Stack,
  StackDivider
 } from '@chakra-ui/react'
import { graphql } from "../gql"
import { Card, Position, Team, Clue } from '../gql/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import '../App.css'

const getBoardQueryDocument = graphql(`
  query GetBoardQueryDocument($roomId: ID!) {
    game(roomId: $roomId) {
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
    }
  }
`)

const getCurrentClueQueryDocument = graphql(`
  query GetCurrentClueQueryDocument($roomId: ID!) {
    game(roomId: $roomId) {
      currentClue {
        word
        number
      }
    }
  }
`)

const getGameRecapQueryDocument = graphql(`
  query GetGameRecapQueryDocument($roomId: ID!) {
    game(roomId: $roomId) {
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

// const initializeGameMutationDocument = graphql(`
//   mutation InitializeGameMutationDocument($roomId: ID!) {
//     initializeGame {
//       game(roomId: $roomId) {
//         board {
//           wordValue
//           typeValue
//           isRevealed
//           position {
//             x
//             y
//           }
//         }
//         turn
//         turnCount
//         winner
//       }
//     }
//   }
// `)

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

const generateClueMutationDocument = graphql(`
  mutation GenerateClueMutationDocument {
    generateClue {
      ok
    }
  }
`)

function Game() {
  const [ board, setBoard ] = useState<Array<Card>>([])
  const [ turn, setTurn ] = useState<Team>(Team.Red)
  const [ turnCount, setTurnCount ] = useState<number>(0)
  const [ clue, setClue ] = useState<Clue>()
  const [ winner, setWinner ] = useState<Team>()
  const [ redClues, setRedClues ] = useState<Array<Clue>>([])
  const [ blueClues, setBlueClues ] = useState<Array<Clue>>([])
  // const [ generateBoard, { loading: boardLoading} ] = useMutation(initializeGameMutationDocument)
  const [ endTurn ] = useMutation(endTurnMutationDocument)
  const [ endGame ] = useMutation(endGameMutationDocument)
  const [ getGameRecap ] = useLazyQuery(getGameRecapQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        console.log(data)
        setRedClues(data.game.redClues!.filter((clue): clue is Clue => clue !== null))
        setBlueClues(data.game.blueClues!.filter((clue): clue is Clue => clue !== null))
        setTurn(Team.Blue)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ loadBoard ] = useLazyQuery(getBoardQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        const prevTurn = turn
        console.log(data)
        setBoard(data.game.board!.filter((card): card is Card => card !== null))
        setTurn(data.game.turn!)
        if (prevTurn != data.game.turn) {
          setShouldGenerateClue(true)
        }
        setTurnCount(data.game.turnCount!)
        setWinner(data.game.winner!)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ getClue ] = useLazyQuery(getCurrentClueQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        console.log(data)
        setClue(data.game.currentClue!)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ guessCard ] = useMutation(guessCardMutationDocument)
  const [ generateClue, { loading: clueLoading} ] = useMutation(generateClueMutationDocument, {
    onCompleted: (data) => {
      if (data.generateClue != null) {
        console.log(data)
        getClue({variables: {roomId: window.location.pathname.split("/")[2]},})
        loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
      }
    }
  })
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldGenerateClue, setShouldGenerateClue] = useState(false);

  const handleGenerateBoard = () => {
    // generateBoard({
    //   onCompleted: (data) => {
    //     if (data.initializeGame != null) {
    //       console.log(data)
    //       setBoard(data.initializeGame.game!.board!.filter((card): card is Card => card !== null))
    //       setTurn(data.initializeGame.game!.turn!)
    //       setTurnCount(data.initializeGame.game!.turnCount!)
    //       setWinner(data.initializeGame.game!.winner!)
    //       setClue(undefined)
    //       setShouldGenerateClue(true)
    //     }
    //   }
    // })
    loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
  }
  // no op change to test ci
  // use effect to load the recap when winner changes
  useEffect(() => {
    if (winner != null) {
      getGameRecap()
    }
  }, [winner, getGameRecap])

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return
    }
    if (shouldGenerateClue) {
      console.log(turn)
      generateClue()
      setShouldGenerateClue(false)
    }
  }, [turn, generateClue, shouldGenerateClue, isInitialized])

  const handleGuessCard = async (position: Position, isRevealed: boolean) => {
    if (clueLoading || isRevealed) {
      return
    }
    try {
      await guessCard({ variables: { "position": {
        x: position.x,
        y: position.y
      } } })
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndTurn = async () => {
    try {
      await endTurn()
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndGame = async () => { 
    try {
      await endGame()
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
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
        onClick={() => handleGuessCard(card!.position!, card!.isRevealed!)}
        cursor={card.isRevealed || clueLoading ? "default" : "pointer"}
        _hover={{
          boxShadow: card.isRevealed || clueLoading ? undefined : 'md',
        }}
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
      <Modal isOpen={winner != null} onClose={handleGenerateBoard} size='xl'>
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
            <Button onClick={handleGenerateBoard} isLoading={false}>Play Again</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      { board.length == 0 ?    
      <Button onClick={handleGenerateBoard} isLoading={false}>Get Board</Button> :
      <Flex direction="column">
        <ChakraCard>
          <CardBody bg={turn == Team.Red ? "#FEB2B2" : "#BEE3F8"}>
            <Flex>
              { clueLoading || !clue ? <Flex gap={3}><Text>Generating Clue...</Text><Spinner /></Flex> : 
              <>
                <Text>Clue: {clue!.word}, {clue!.number}</Text>
                <Spacer />
                <Flex gap={3}>
                  <Text>Guesses Remaining: {turnCount}</Text>
                  <Button onClick={handleEndTurn} size="xs">End Turn</Button>
                  <Button onClick={handleEndGame} size="xs">End Game</Button>
                </Flex>
              </>
              }
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

export default Game
