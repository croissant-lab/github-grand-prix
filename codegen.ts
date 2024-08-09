import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  documents: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.gql'],
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        fetcher: 'graphql-request',
      },
    },
  },
};
export default config;
