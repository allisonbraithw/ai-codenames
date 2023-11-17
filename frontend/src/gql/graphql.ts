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

export type Game = {
  __typename?: 'Game';
  board?: Maybe<Array<Maybe<Card>>>;
  currentClue?: Maybe<Clue>;
  turn?: Maybe<Team>;
  turnCount?: Maybe<Scalars['Int']['output']>;
};

export type GuessCard = {
  __typename?: 'GuessCard';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type InitializeGame = {
  __typename?: 'InitializeGame';
  game?: Maybe<Game>;
};

export type Mutation = {
  __typename?: 'Mutation';
  guessCard?: Maybe<GuessCard>;
  initializeGame?: Maybe<InitializeGame>;
};


export type MutationGuessCardArgs = {
  position: PositionInput;
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

export enum Team {
  Blue = 'BLUE',
  Red = 'RED'
}

export type GetBoardQueryDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBoardQueryDocumentQuery = { __typename?: 'Query', game?: { __typename?: 'Game', turn?: Team | null, turnCount?: number | null, board?: Array<{ __typename?: 'Card', wordValue?: string | null, typeValue?: CardType | null, isRevealed?: boolean | null, position?: { __typename?: 'Position', x?: number | null, y?: number | null } | null } | null> | null, currentClue?: { __typename?: 'Clue', word?: string | null, number?: number | null } | null } | null };

export type InitializeGameMutationDocumentMutationVariables = Exact<{ [key: string]: never; }>;


export type InitializeGameMutationDocumentMutation = { __typename?: 'Mutation', initializeGame?: { __typename?: 'InitializeGame', game?: { __typename?: 'Game', turn?: Team | null, turnCount?: number | null, board?: Array<{ __typename?: 'Card', wordValue?: string | null, typeValue?: CardType | null, isRevealed?: boolean | null, position?: { __typename?: 'Position', x?: number | null, y?: number | null } | null } | null> | null, currentClue?: { __typename?: 'Clue', word?: string | null, number?: number | null } | null } | null } | null };

export type GuessCardMutationDocumentMutationVariables = Exact<{
  position: PositionInput;
}>;


export type GuessCardMutationDocumentMutation = { __typename?: 'Mutation', guessCard?: { __typename?: 'GuessCard', ok?: boolean | null } | null };


export const GetBoardQueryDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardQueryDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordValue"}},{"kind":"Field","name":{"kind":"Name","value":"typeValue"}},{"kind":"Field","name":{"kind":"Name","value":"isRevealed"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"}},{"kind":"Field","name":{"kind":"Name","value":"turnCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentClue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]} as unknown as DocumentNode<GetBoardQueryDocumentQuery, GetBoardQueryDocumentQueryVariables>;
export const InitializeGameMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitializeGameMutationDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initializeGame"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordValue"}},{"kind":"Field","name":{"kind":"Name","value":"typeValue"}},{"kind":"Field","name":{"kind":"Name","value":"isRevealed"}},{"kind":"Field","name":{"kind":"Name","value":"position"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"turn"}},{"kind":"Field","name":{"kind":"Name","value":"turnCount"}},{"kind":"Field","name":{"kind":"Name","value":"currentClue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"number"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InitializeGameMutationDocumentMutation, InitializeGameMutationDocumentMutationVariables>;
export const GuessCardMutationDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GuessCardMutationDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guessCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GuessCardMutationDocumentMutation, GuessCardMutationDocumentMutationVariables>;