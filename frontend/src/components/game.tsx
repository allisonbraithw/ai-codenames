import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { TinyliciousClient } from '@fluidframework/tinylicious-client'
import { SharedMap } from 'fluid-framework'
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

//#region gql defs
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

const guessCardMutationDocument = graphql(`
  mutation GuessCardMutationDocument($position: PositionInput!, $roomId: ID!) {
    guessCard(position: $position, roomId: $roomId) {
      ok
    }
  }
`)

const endTurnMutationDocument = graphql(`
  mutation EndTurnMutationDocument($roomId: ID!) {
    endTurn(roomId: $roomId) {
      ok
    }
  }
`)

const endGameMutationDocument = graphql(`
  mutation EndGameMutationDocument($roomId: ID!) {
    endGame(roomId: $roomId) {
      ok
    }
  }
`)

const generateClueMutationDocument = graphql(`
  mutation GenerateClueMutationDocument($roomId: ID!) {
    generateClue(roomId: $roomId) {
      ok
      clue {
        word
        number
      }
    }
  }
`)
//#endregion

const getFluidData = async () => {
  const client = new TinyliciousClient()
  const containerSchema = {
    initialObjects: { 
      sharedClue: SharedMap,
      sharedTurn: SharedMap,
      sharedBoard: SharedMap,
      sharedWinner: SharedMap,
    }
  }
  let container;
  const containerId = location.hash.substring(1);
  ({container} = await client.getContainer(containerId, containerSchema));

  return container.initialObjects
}

function Game() {
  const navigate = useNavigate();
  //#region old state
  const [ redClues, setRedClues ] = useState<Array<Clue>>([])
  const [ blueClues, setBlueClues ] = useState<Array<Clue>>([])
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldGenerateClue, setShouldGenerateClue] = useState(false);
  //#endregion
  //#region fluid state
  const [fluidSharedObjects, setFluidSharedObjects] = useState<any>();
  const [fluidLoading, setFluidLoading] = useState(true);
  const [localClue, setLocalClue] = useState<Clue>();
  const [localTurn, setLocalTurn] = useState<Team>(Team.Red)
  const [localTurnCount, setLocalTurnCount] = useState<number>(0)
  const [localBoard, setLocalBoard] = useState<Array<Card>>([])
  const [localWinner, setLocalWinner] = useState<Team>()
  const [localClueLoading, setLocalClueLoading] = useState(false)
  //#endregion
  //#region gql ops
  const [ endTurn ] = useMutation(endTurnMutationDocument)
  const [ endGame ] = useMutation(endGameMutationDocument)
  const [ getGameRecap ] = useLazyQuery(getGameRecapQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        setRedClues(data.game.redClues!.filter((clue): clue is Clue => clue !== null))
        setBlueClues(data.game.blueClues!.filter((clue): clue is Clue => clue !== null))
        setLocalTurn(Team.Blue)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ loadBoard ] = useLazyQuery(getBoardQueryDocument, {
    onCompleted: (data) => {
      if (data.game != null) {
        const prevTurn = localTurn
        fluidSharedObjects.sharedBoard.set("board", data.game.board!.filter((card): card is Card => card !== null))
        fluidSharedObjects.sharedTurn.set("team", data.game.turn!)
        fluidSharedObjects.sharedTurn.set("count", data.game.turnCount!)
        if (prevTurn != data.game.turn) {
          console.log("setting should generate clue as turn has changed")
          setShouldGenerateClue(true)
        }
        fluidSharedObjects.sharedWinner.set("winner", data.game.winner!)
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ guessCard ] = useMutation(guessCardMutationDocument)
  const [ generateClue, { loading: clueLoading } ] = useMutation(generateClueMutationDocument, {
    onCompleted: (data) => {
      if (data.generateClue != null) {
        fluidSharedObjects.sharedClue.set("clue", data.generateClue.clue!)
        loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
      }
    }
  })
  //#endregion


  useEffect(() => {
    console.log("setting fluid loading")
    setFluidLoading(true)
    getFluidData()
    .then(data => {
      setFluidSharedObjects(data)
      console.log("unsetting fluid loading")
    });
  }, [])

  useEffect(() => {
    if (fluidSharedObjects) {
      const { sharedClue, sharedTurn, sharedBoard, sharedWinner } = fluidSharedObjects;
      const updateLocalClue = () => setLocalClue(sharedClue.get('clue'));
      const updateLocalClueLoading = () => setLocalClueLoading(sharedClue.get('loading'));
      const updateLocalTurn = () => setLocalTurn(sharedTurn.get('team'))
      const updateLocalTurnCount = () => setLocalTurnCount(sharedTurn.get('count'))
      const updateLocalBoard = () => setLocalBoard(sharedBoard.get('board'))
      const updateLocalWinner = () => setLocalWinner(sharedWinner.get('winner'))
      updateLocalClue();
      updateLocalTurn();
      updateLocalTurnCount();
      sharedClue.on("valueChanged", updateLocalClue);
      sharedClue.on("valueChanged", updateLocalClueLoading);
      sharedTurn.on("valueChanged", updateLocalTurn);
      sharedTurn.on("valueChanged", updateLocalTurnCount);
      sharedBoard.on("valueChanged", updateLocalBoard);
      sharedWinner.on("valueChanged", updateLocalWinner);
      setFluidLoading(false)
      return () => {
        sharedClue.off("valueChanged", updateLocalClue);
        sharedClue.off("valueChanged", updateLocalClueLoading);
        sharedTurn.off("valueChanged", updateLocalTurn);
        sharedTurn.off("valueChanged", updateLocalTurnCount);
        sharedBoard.off("valueChanged", updateLocalBoard);
        sharedWinner.off("valueChanged", updateLocalWinner);
      }
    } else {
      return;
    }
  }, [fluidSharedObjects])

  // navigate to the home page if a playerId hasn't been set
  useEffect(() => {
    if (localStorage.getItem("playerId") == null) {
      navigate(`/`)
    }
  })

  // use effect to set clueLoading for fluid
  useEffect(() => {
    console.log("setting fluid clue loading")
    if (clueLoading) {
      fluidSharedObjects.sharedClue.set("loading", true)
    } else {
      fluidSharedObjects.sharedClue.set("loading", false)
    }
  }, [clueLoading, fluidSharedObjects])

  // use effect to load the recap when winner changes
  useEffect(() => {
    if (localWinner != null) {
      getGameRecap({variables: {roomId: window.location.pathname.split("/")[2]},})
    }
  }, [localWinner, getGameRecap])

  useEffect(() => {
    if (!isInitialized) {
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    }
  }, [isInitialized, loadBoard])

  useEffect(() => {
    if (fluidLoading || localClueLoading) {
      console.log("wait for fluid to load")
      return
    }
    if (localClue == undefined) {
      console.log("generating clue as local clue is undefined")
      setShouldGenerateClue(true)
    }
  }, [fluidLoading, localClue, localClueLoading])

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return
    }
    if (shouldGenerateClue) {
      console.log("generating clue for: " + localTurn)
      generateClue({variables: {roomId: window.location.pathname.split("/")[2]},})
      setShouldGenerateClue(false)
    }
  }, [localTurn, generateClue, shouldGenerateClue, isInitialized, fluidLoading])

  const handleGuessCard = async (position: Position, isRevealed: boolean) => {
    if (clueLoading || localClueLoading || isRevealed || localStorage.getItem("teamColor") != localTurn) {
      return
    }
    try {
      await guessCard({ variables: { "position": {
        x: position.x,
        y: position.y
      },
      "roomId": window.location.pathname.split("/")[2]
     } })
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndTurn = async () => {
    try {
      await endTurn({variables: {roomId: window.location.pathname.split("/")[2]},})
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    } catch (e) {
      console.log(e)
    }
  }

  const handleEndGame = async () => { 
    try {
      await endGame({variables: {roomId: window.location.pathname.split("/")[2]},})
      loadBoard({variables: {roomId: window.location.pathname.split("/")[2]},})
    } catch (e) {
      console.log(e)
    }
  }

  const handleReturnToLanding = () => {
    localStorage.clear()
    navigate(`/`)
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
        cursor={card.isRevealed || clueLoading || localClueLoading || localStorage.getItem("teamColor") != localTurn? "default" : "pointer"}
        _hover={{
          boxShadow: card.isRevealed || clueLoading || localClueLoading || localStorage.getItem("teamColor") != localTurn ? undefined : 'md',
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
      <Modal isOpen={localWinner != null} onClose={handleReturnToLanding} size='xl'>
        <ModalOverlay />  
        <ModalContent>
          <ModalHeader>Winner: {localWinner}</ModalHeader>
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
            <Button onClick={handleReturnToLanding} isLoading={false}>Play Again</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> 
      <Flex direction="column">
        <Flex>
          <Text>You are playing the {localStorage.getItem("teamColor")} team</Text>
        </Flex>
        <ChakraCard>
          <CardBody bg={localTurn == Team.Red ? "#FEB2B2" : "#BEE3F8"}>
            <Flex>
              { clueLoading || localClueLoading || fluidLoading || !localClue ? <Flex gap={3}><Text>Generating Clue...</Text><Spinner /></Flex> : 
              <>
                <Text>Clue: {localClue.word}, {localClue.number}</Text>
                <Spacer />
                <Flex gap={3}>
                  <Text>Guesses Remaining: {localTurnCount}</Text>
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
          {localBoard.map((card) => (
              renderCard(card)
          )
          )}
        </SimpleGrid>
      </Flex>
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
