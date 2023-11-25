import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphql } from "../gql"
import { Button } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';

// const startRoomMutationDocument = graphql(`
//     mutation StartRoomMutationDocument {
//         startRoom {
//             room {
//                 id
//             }
//         }
//     }
// `)

function LandingPage() {
    const navigate = useNavigate();
    const [ startRoom ] = useMutation(startRoomMutationDocument, {
        onCompleted: (data) => {
            console.log(data);
            navigate(`/game/${data!.startRoom!.room!.id}`);
        }
    });

    const handleOnClick = () => {
        console.log("Clicked");
        startRoom();
    }

    return (
        <Button onClick={handleOnClick}>Start New Game</Button>
    )
}

export default LandingPage;