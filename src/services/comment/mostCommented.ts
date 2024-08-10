import { graphql } from '@/src/gql';

export const mostCommentedQueryDocument = graphql(`
  query MostCommentedQueryDocument($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
      pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC},) {
        nodes {
          title
          author{
            login
          }
          comments(first: 100) {
            nodes {
              author {
                login
              }
              body
            }
          }
        }
      }
    }
  }
`);
