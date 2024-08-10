import { graphql } from '@/src/gql';

export const mostCommentedQueryDocument = graphql(`
  query MostCommentedQueryDocument{
    viewer {
      login
    }
  }
`);
