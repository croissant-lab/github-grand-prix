import { useMostCommentedQuery } from '@/src/gql/graphql';

export const Post = () => {
  const { isLoading, data } = useMostCommentedQuery({
    endpoint: process.env.ENDPOINT ?? '',
    fetchParams: {
      headers: {
        Authorization: `Bearer ${process.env.PAT}`,
      },
    },
  });
};
