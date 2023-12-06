/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation StartRoomMutationDocument($playerId: String!) {\n        startRoom(playerId: $playerId) {\n            room {\n                id\n            }\n        }\n    }\n": types.StartRoomMutationDocumentDocument,
    "\n    mutation JoinRoomMutationDocument($playerId: String!, $roomId: String!, $team: Team!) {\n        joinRoom(playerId: $playerId, roomId: $roomId, team: $team) {\n            room {\n                id\n            }\n        }\n    }\n": types.JoinRoomMutationDocumentDocument,
    "\n  query GetBoardQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      winner\n    }\n  }\n": types.GetBoardQueryDocumentDocument,
    "\n  query GetGameRecapQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      redClues {\n        word\n        number\n        reasoning\n      }\n      blueClues {\n        word\n        number\n        reasoning\n      }\n    }\n  }\n": types.GetGameRecapQueryDocumentDocument,
    "\n  mutation GuessCardMutationDocument($position: PositionInput!, $roomId: ID!) {\n    guessCard(position: $position, roomId: $roomId) {\n      ok\n    }\n  }\n": types.GuessCardMutationDocumentDocument,
    "\n  mutation EndTurnMutationDocument($roomId: ID!) {\n    endTurn(roomId: $roomId) {\n      ok\n    }\n  }\n": types.EndTurnMutationDocumentDocument,
    "\n  mutation EndGameMutationDocument($roomId: ID!) {\n    endGame(roomId: $roomId) {\n      ok\n    }\n  }\n": types.EndGameMutationDocumentDocument,
    "\n  mutation GenerateClueMutationDocument($roomId: ID!) {\n    generateClue(roomId: $roomId) {\n      ok\n      clue {\n        word\n        number\n      }\n    }\n  }\n": types.GenerateClueMutationDocumentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation StartRoomMutationDocument($playerId: String!) {\n        startRoom(playerId: $playerId) {\n            room {\n                id\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation StartRoomMutationDocument($playerId: String!) {\n        startRoom(playerId: $playerId) {\n            room {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation JoinRoomMutationDocument($playerId: String!, $roomId: String!, $team: Team!) {\n        joinRoom(playerId: $playerId, roomId: $roomId, team: $team) {\n            room {\n                id\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation JoinRoomMutationDocument($playerId: String!, $roomId: String!, $team: Team!) {\n        joinRoom(playerId: $playerId, roomId: $roomId, team: $team) {\n            room {\n                id\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBoardQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      winner\n    }\n  }\n"): (typeof documents)["\n  query GetBoardQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      winner\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGameRecapQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      redClues {\n        word\n        number\n        reasoning\n      }\n      blueClues {\n        word\n        number\n        reasoning\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGameRecapQueryDocument($roomId: ID!) {\n    game(roomId: $roomId) {\n      redClues {\n        word\n        number\n        reasoning\n      }\n      blueClues {\n        word\n        number\n        reasoning\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GuessCardMutationDocument($position: PositionInput!, $roomId: ID!) {\n    guessCard(position: $position, roomId: $roomId) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation GuessCardMutationDocument($position: PositionInput!, $roomId: ID!) {\n    guessCard(position: $position, roomId: $roomId) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EndTurnMutationDocument($roomId: ID!) {\n    endTurn(roomId: $roomId) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation EndTurnMutationDocument($roomId: ID!) {\n    endTurn(roomId: $roomId) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EndGameMutationDocument($roomId: ID!) {\n    endGame(roomId: $roomId) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation EndGameMutationDocument($roomId: ID!) {\n    endGame(roomId: $roomId) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GenerateClueMutationDocument($roomId: ID!) {\n    generateClue(roomId: $roomId) {\n      ok\n      clue {\n        word\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GenerateClueMutationDocument($roomId: ID!) {\n    generateClue(roomId: $roomId) {\n      ok\n      clue {\n        word\n        number\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;