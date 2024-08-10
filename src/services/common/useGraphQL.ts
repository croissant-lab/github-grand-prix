import { ENDPOINT, GITHUB_TOKEN } from '@/src/constants/env';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { useReducer } from 'react';

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> & { executeQuery: () => void } {
  const [enabled, setEnabled] = useReducer(() => true, false);

  const query = useQuery({
    // biome-ignore lint/suspicious/noExplicitAny: temp
    queryKey: [(document as any).definitions[0].name.value, variables],
    enabled,
    queryFn: async ({ queryKey }: { queryKey: unknown[] }) => {
      console.log(queryKey);
      return await request({
        url: ENDPOINT,
        document,
        variables: queryKey[1] ? queryKey[1] : undefined,
        requestHeaders: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });
    },
  });

  const executeQuery = () => {
    if (enabled) {
      query.refetch();
    } else {
      setEnabled();
    }
  };

  return {
    executeQuery,
    ...query,
  };
}
