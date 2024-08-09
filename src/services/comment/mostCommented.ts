import { graphql } from '@/src/gql';

graphql(`
  query MostCommented{
    viewer {
      login
    }
  }
`);
