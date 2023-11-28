import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.tsx'
import Game from "./components/game.tsx"
import LandingPage from './components/LandingPage.tsx'
import './index.css'

const BASE_GRAPHQL_URL = import.meta.env.VITE_BASE_GRAPHQL_URL;

const client = new ApolloClient({
  uri: BASE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/game/:gameId",
        element: <Game />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
