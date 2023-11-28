import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphql } from "../gql"
import { Button, Input, Spacer, Text, Flex } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';

const startRoomMutationDocument = graphql(`
    mutation StartRoomMutationDocument {
        startRoom {
            room {
                id
            }
        }
    }
`)

function LandingPage() {
    const navigate = useNavigate();
    const [ gameId, setGameId ] = useState("");
    const [ startRoom ] = useMutation(startRoomMutationDocument, {
        onCompleted: (data) => {
            console.log(data);
            navigate(`/game/${data!.startRoom!.room!.id}`);
        }
    });

    const handleNewRoom = () => {
        console.log("Clicked");
        startRoom();
    }

    const handleJoinRoom = () => {
        console.log("Clicked");
        navigate(`/game/${gameId}`)
    }


    return (
        <>
            <Button onClick={handleNewRoom}>Start New Game</Button>
            <Spacer p={2} />
            <Text>OR</Text>
            <Spacer p={2} />
            <Flex>
                <Input placeholder="Enter Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                <Spacer p={2} />
                <Button onClick={handleJoinRoom}>Join Game</Button>
            </Flex>
        </>
    )
}

export default LandingPage;