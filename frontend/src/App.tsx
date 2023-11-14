// import { useState } from 'react'
import { SimpleGrid, Box, Spacer } from '@chakra-ui/react'
import { graphql } from "../src/gql"
import { useQuery } from '@apollo/client'
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

function App() {

  const { data } = useQuery(getBoardQueryDocument)

  return (
    <>
      <h1>CodenamesAI</h1>
      <Spacer p={5}/>
      <SimpleGrid columns={5} spacing={10}>
        {data?.board?.map((card) => (
            <Box bg="gray" width="200px" height="100px" display="flex" alignItems="center" justifyContent="center">{card?.wordValue}</Box>
        )
        )}
      </SimpleGrid>
    </>
  )
}

export default App
