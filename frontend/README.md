# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Graphql Codegen
We use graphql-codegen to generate typescript types from graphql queries. To generate the types, run `make generate`, or `npm run codegen` in the frontend directory. This will generate the types in `src/gql/graphql.tx`. You can then import the types in your components like so:
```typescript
import { useGetUsersQuery } from '../src/gql/graphql';
```
You should also register the mutations and queries you will use with the codegen via the `graphql` module, for example:
```typescript
import { graphql } from '../src/gql';

const getUserDocument = graphql`
  query getUser($id: String!) {
    user(id: $id) {
      id
      name
    }
  }
`;
```
