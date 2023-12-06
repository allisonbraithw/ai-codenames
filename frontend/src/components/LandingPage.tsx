import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphql } from "../gql"
import { Button, Input, Spacer, Text, Flex, FormControl, FormErrorMessage} from '@chakra-ui/react';
import { Team } from '../gql/graphql'
import { useMutation } from '@apollo/client';

const startRoomMutationDocument = graphql(`
    mutation StartRoomMutationDocument($playerId: String!) {
        startRoom(playerId: $playerId) {
            room {
                id
            }
        }
    }
`)

const joinRoomMutationDocument = graphql(`
    mutation JoinRoomMutationDocument($playerId: String!, $roomId: String!, $team: Team!) {
        joinRoom(playerId: $playerId, roomId: $roomId, team: $team) {
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
    const [ joinRoom, { error: errorJoining } ] = useMutation(joinRoomMutationDocument, {
        onCompleted: (data) => {
            console.log(data);
            navigate(`/game/${data!.joinRoom!.room!.id}`);
        }
    });

    const handleNewRoom = () => {
        localStorage.setItem("playerId", "1")
        localStorage.setItem("teamColor", "RED")
        startRoom({ variables: { playerId: "1" }});
    }

    const handleJoinRoom = () => {
        localStorage.setItem("playerId", "2")
        localStorage.setItem("teamColor", "BLUE")
        joinRoom({ variables: { playerId: "2", roomId: gameId, team: Team.Blue }});
    }


    return (
        <>
            <Button onClick={handleNewRoom}>Start New Game</Button>
            <Spacer p={2} />
            <Text>OR</Text>
            <Spacer p={2} />
            <FormControl isInvalid={errorJoining != null}>
                <Flex>
                    <Input placeholder="Enter Game ID" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                    <Spacer p={2} />
                    <Button onClick={handleJoinRoom}>Join Game</Button>
                </Flex>
                {errorJoining != null && <FormErrorMessage>{errorJoining.message}</FormErrorMessage>}
            </FormControl>

        </>
    )
}

export default LandingPage;