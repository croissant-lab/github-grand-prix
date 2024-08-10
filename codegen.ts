import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
    },
  },
};
export default config;
