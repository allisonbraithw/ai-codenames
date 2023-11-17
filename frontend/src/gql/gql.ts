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
    "\n  query GetBoardQueryDocument {\n    game {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      currentClue {\n        word\n        number\n      }\n    }\n  }\n": types.GetBoardQueryDocumentDocument,
    "\n  mutation InitializeGameMutationDocument {\n    initializeGame {\n      game {\n        board {\n          wordValue\n          typeValue\n          isRevealed\n          position {\n            x\n            y\n          }\n        }\n        turn\n        turnCount\n        currentClue {\n          word\n          number\n        }\n      }\n    }\n  }\n": types.InitializeGameMutationDocumentDocument,
    "\n  mutation GuessCardMutationDocument($position: PositionInput!) {\n    guessCard(position: $position) {\n      ok\n    }\n  }\n": types.GuessCardMutationDocumentDocument,
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
export function graphql(source: "\n  query GetBoardQueryDocument {\n    game {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      currentClue {\n        word\n        number\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetBoardQueryDocument {\n    game {\n      board {\n        wordValue\n        typeValue\n        isRevealed\n        position {\n          x\n          y\n        }\n      }\n      turn\n      turnCount\n      currentClue {\n        word\n        number\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation InitializeGameMutationDocument {\n    initializeGame {\n      game {\n        board {\n          wordValue\n          typeValue\n          isRevealed\n          position {\n            x\n            y\n          }\n        }\n        turn\n        turnCount\n        currentClue {\n          word\n          number\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation InitializeGameMutationDocument {\n    initializeGame {\n      game {\n        board {\n          wordValue\n          typeValue\n          isRevealed\n          position {\n            x\n            y\n          }\n        }\n        turn\n        turnCount\n        currentClue {\n          word\n          number\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GuessCardMutationDocument($position: PositionInput!) {\n    guessCard(position: $position) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation GuessCardMutationDocument($position: PositionInput!) {\n    guessCard(position: $position) {\n      ok\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;