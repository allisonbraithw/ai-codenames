import React from 'react'
import { Spacer } from '@chakra-ui/react'
import { Outlet } from "react-router-dom"
import './App.css'


function App() {

  return (
    <>
      <h1>CodenamesAI</h1>
      <Spacer p={5}/>
      <Outlet />
    </>
  )
}

export default App
