import { graphql } from '@/src/gql';

export const timeUntilApproveQueryDocument = graphql(`
  query timeUntilApproveQueryDocument($owner: String!, $repo: String!, $approveNumber: Int = 1, $maxPullRequestNumber: Int = 10) {
    repository(owner: $owner, name: $repo) {
      pullRequests(first: $maxPullRequestNumber, states: MERGED, orderBy: {field: CREATED_AT, direction: DESC},) {
        nodes {
          repository{
            name
          }
          url
          title
          # Draft → Openのtimestampがとれないので仕方なく
          createdAt
          changedFiles
          totalCommentsCount
          author{
            login
          }
          reviews(first: $approveNumber, states: APPROVED){
            totalCount
            nodes{
              state
              createdAt
              author{
                login
              }
            }
          }
          comments(first: 100){
            totalCount
            nodes {
              url 
              author{
                login
              }
              reactions{
                totalCount
              }
            }
          }
        }
      }
    }
  }
`);
