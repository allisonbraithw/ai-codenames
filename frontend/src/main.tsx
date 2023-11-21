import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

const BASE_GRAPHQL_URL = import.meta.env.VITE_BASE_GRAPHQL_URL;

const client = new ApolloClient({
  uri: BASE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
