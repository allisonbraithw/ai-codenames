import React from 'react'
import { Spacer } from '@chakra-ui/react'
import { Outlet } from "react-router-dom"
import { TinyliciousClient } from '@fluidframework/tinylicious-client'
import { SharedMap } from 'fluid-framework'
import './App.css'


const getFluidData = async () => {
  const client = new TinyliciousClient()
  const containerSchema = {
    initialObjects: { sharedTimestamp: SharedMap }
  }
  let container;
  const containerId = location.hash.substring(1);
  if (containerId) {
    ({container} = await client.getContainer(containerId, containerSchema));
  } else {
    ({container} = await client.createContainer(containerSchema));
    const id = await container.attach();
    location.hash = id;
  }
  return container.initialObjects
}

function App() {
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState<any>();
  const [localTimestamp, setLocalTimestamp] = React.useState<any>();


  React.useEffect(() => {
    getFluidData()
    .then(data => setFluidSharedObjects(data));
  }, [])

  React.useEffect(() => {
    if (fluidSharedObjects) {
      const { sharedTimestamp } = fluidSharedObjects;
      const updateLocalTimestamp = () => setLocalTimestamp({ time: sharedTimestamp.get('time') });
      updateLocalTimestamp();
      sharedTimestamp.on("valueChanged", updateLocalTimestamp);
      return () => sharedTimestamp.off("valueChanged", updateLocalTimestamp);
    } else {
      return;
    }
  }, [fluidSharedObjects])

  return (
    <>
      <h1>CodenamesAI</h1>
      {localTimestamp ?         
        <div className="App">
            <button onClick={() => fluidSharedObjects.sharedTimestamp.set("time", Date.now().toString())}>
                Get Time
            </button>
            <span>{localTimestamp.time}</span>
        </div> : null}
      <Spacer p={5}/>
      <Outlet />
    </>
  )
}

export default App
