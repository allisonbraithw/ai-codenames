// import { useState } from 'react'
import { SimpleGrid, Box, Spacer } from '@chakra-ui/react'
import { graphql } from "../src/gql"
import './App.css'

const getBoardQuery = graphql(`
  query {
    board {
      card {
        word
        type
        revealed
      }
    }
  }
`)

function App() {

  const cards = ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10"]

  return (
    <>
      <h1>CodenamesAI</h1>
      <Spacer p={5}/>
      <SimpleGrid columns={5} spacing={10}>
        {cards.map((card) => (
            <Box bg="gray" width="200px" height="100px" display="flex" alignItems="center" justifyContent="center">{card}</Box>
        )
        )}
      </SimpleGrid>
    </>
  )
}

export default App
