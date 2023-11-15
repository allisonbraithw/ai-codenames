import { useState } from 'react'
import { SimpleGrid, Box, Spacer, Flex, Text, Button } from '@chakra-ui/react'
import { graphql } from "../src/gql"
import { Card, Position } from '../src/gql/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import './App.css'

const getBoardQueryDocument = graphql(`
  query GetBoardQueryDocument {
    board {
      wordValue
      typeValue
      isRevealed
      position {
        x
        y
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

function App() {
  const [ board, setBoard ] = useState<Array<Card>>([])
  const [ loadBoard ] = useLazyQuery(getBoardQueryDocument, {
    onCompleted: (data) => {
      if (data.board != null) {
        console.log(data.board)
        setBoard(data.board.filter((card): card is Card => card !== null))
      }
    },
    fetchPolicy: 'no-cache'
  })
  const [ guessCard ] = useMutation(guessCardMutationDocument)

  const handleLoadBoard = () => {
    loadBoard()
  }

  const handleGuessCard = (position: Position) => {
    guessCard({ variables: { "position": {
      x: position.x,
      y: position.y
    } } })
    loadBoard()
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


  return (
    <>
      <h1>CodenamesAI</h1>
      <Spacer p={5}/>
      <Button onClick={handleLoadBoard}>Get Board</Button>
      <Spacer p={5}/>
      <SimpleGrid columns={5} spacing={10}>
        {board.map((card) => (
            renderCard(card)
        )
        )}
      </SimpleGrid>
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
