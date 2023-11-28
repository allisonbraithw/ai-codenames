/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Card = {
  __typename?: 'Card';
  isRevealed?: Maybe<Scalars['Boolean']['output']>;
  position?: Maybe<Position>;
  typeValue?: Maybe<CardType>;
  wordValue?: Maybe<Scalars['String']['output']>;
};

export enum CardType {
  Assassin = 'ASSASSIN',
  BlueAgent = 'BLUE_AGENT',
  Bystander = 'BYSTANDER',
  RedAgent = 'RED_AGENT'
}

export type Clue = {
  __typename?: 'Clue';
  number?: Maybe<Scalars['Int']['output']>;
  reasoning?: Maybe<Scalars['String']['output']>;
  word?: Maybe<Scalars['String']['output']>;
};

export type EndGame = {
  __typename?: 'EndGame';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type EndTurn = {
  __typename?: 'EndTurn';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type Game = {
  __typename?: 'Game';
  blueClues?: Maybe<Array<Maybe<Clue>>>;
  board?: Maybe<Array<Maybe<Card>>>;
  currentClue?: Maybe<Clue>;
  redClues?: Maybe<Array<Maybe<Clue>>>;
  turn?: Maybe<Team>;
  turnCount?: Maybe<Scalars['Int']['output']>;
  winner?: Maybe<Team>;
};

export type GenerateClue = {
  __typename?: 'GenerateClue';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type GuessCard = {
  __typename?: 'GuessCard';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  endGame?: Maybe<EndGame>;
  endTurn?: Maybe<EndTurn>;
  generateClue?: Maybe<GenerateClue>;
  guessCard?: Maybe<GuessCard>;
  startRoom?: Maybe<StartRoom>;
};


export type MutationEndGameArgs = {
  roomId: Scalars['ID']['input'];
};


export type MutationEndTurnArgs = {
  roomId: Scalars['ID']['input'];
};


export type MutationGenerateClueArgs = {
  roomId: Scalars['ID']['input'];
};


export type MutationGuessCardArgs = {
  position: PositionInput;
  roomId: Scalars['ID']['input'];
};

export type Position = {
  __typename?: 'Position';
  x?: Maybe<Scalars['Int']['output']>;
  y?: Maybe<Scalars['Int']['output']>;
};

export type PositionInput = {
  x?: InputMaybe<Scalars['Int']['input']>;
  y?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  card?: Maybe<Card>;
  game?: Maybe<Game>;
};


export type QueryCardArgs = {
  position: PositionInput;
};


export type QueryGameArgs = {
  roomId: Scalars['ID']['input'];
};

export type Room = {
  __typename?: 'Room';
  game?: Maybe<Game>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type StartRoom = {
  __typename?: 'StartRoom';
  room?: Maybe<Room>;
};

export enum Team {
  Blue = 'BLUE',
  Red = 'RED'
}

export type StartRoomMutationDocumentMutationVariables = Exact<{ [key: string]: never; }>;


export type StartRoomMutationDocumentMutation = { __typename?: 'Mutation', startRoom?: { __typename?: 'StartRoom', room?: { __typename?: 'Room', id?: string | null } | null } | null };

export type GetBoardQueryDocumentQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GetBoardQueryDocumentQuery = { __typename?: 'Query', game?: { __typename?: 'Game', turn?: Team | null, turnCount?: number | null, winner?: Team | null, board?: Array<{ __typename?: 'Card', wordValue?: string | null, typeValue?: CardType | null, isRevealed?: boolean | null, position?: { __typename?: 'Position', x?: number | null, y?: number | null } | null } | null> | null } | null };

export type GetCurrentClueQueryDocumentQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GetCurrentClueQueryDocumentQuery = { __typename?: 'Query', game?: { __typename?: 'Game', currentClue?: { __typename?: 'Clue', word?: string | null, number?: number | null } | null } | null };

export type GetGameRecapQueryDocumentQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GetGameRecapQueryDocumentQuery = { __typename?: 'Query', game?: { __typename?: 'Game', redClues?: Array<{ __typename?: 'Clue', word?: string | null, number?: number | null, reasoning?: string | null } | null> | null, blueClues?: Array<{ __typename?: 'Clue', word?: string | null, number?: number | null, reasoning?: string | null } | null> | null } | null };

export type GuessCardMutationDocumentMutationVariables = Exact<{
  position: PositionInput;
  roomId: Scalars['ID']['input'];
}>;


export type GuessCardMutationDocumentMutation = { __typename?: 'Mutation', guessCard?: { __typename?: 'GuessCard', ok?: boolean | null } | null };

export type EndTurnMutationDocumentMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type EndTurnMutationDocumentMutation = { __typename?: 'Mutation', endTurn?: { __typename?: 'EndTurn', ok?: boolean | null } | null };

export type EndGameMutationDocumentMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type EndGameMutationDocumentMutation = { __typename?: 'Mutation', endGame?: { __typename?: 'EndGame', ok?: boolean | null } | null };

export type GenerateClueMutationDocumentMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GenerateClueMutationDocumentMutation = { __typename?: 'Mutation', generateClue?: { __typename?: 'GenerateClue', ok?: boolean | null } | null };


export const StartRoomMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartRoomMutationDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startRoom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<StartRoomMutationDocumentMutation, StartRoomMutationDocumentMutationVariables>;
export const GetBoardQueryDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardQueryDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordValue"}},{"kind":"Field","name":{"kind":"Name","value":"typeValue"}},{"kind":"Field","name":{"kind":"Name","value":"isRevealed"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"}},{"kind":"Field","name":{"kind":"Name","value":"turnCount"}},{"kind":"Field","name":{"kind":"Name","value":"winner"}}]}}]}}]} as unknown as DocumentNode<GetBoardQueryDocumentQuery, GetBoardQueryDocumentQueryVariables>;
export const GetCurrentClueQueryDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentClueQueryDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentClue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<GetCurrentClueQueryDocumentQuery, GetCurrentClueQueryDocumentQueryVariables>;
export const GetGameRecapQueryDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGameRecapQueryDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"redClues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"reasoning"}}]}},{"kind":"Field","name":{"kind":"Name","value":"blueClues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"reasoning"}}]}}]}}]}}]} as unknown as DocumentNode<GetGameRecapQueryDocumentQuery, GetGameRecapQueryDocumentQueryVariables>;
export const GuessCardMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GuessCardMutationDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PositionInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guessCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GuessCardMutationDocumentMutation, GuessCardMutationDocumentMutationVariables>;
export const EndTurnMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndTurnMutationDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endTurn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<EndTurnMutationDocumentMutation, EndTurnMutationDocumentMutationVariables>;
export const EndGameMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndGameMutationDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<EndGameMutationDocumentMutation, EndGameMutationDocumentMutationVariables>;
export const GenerateClueMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateClueMutationDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateClue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GenerateClueMutationDocumentMutation, GenerateClueMutationDocumentMutationVariables>;