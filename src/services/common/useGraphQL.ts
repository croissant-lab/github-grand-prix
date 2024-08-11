import { ENDPOINT, GITHUB_TOKEN } from '@/src/constants/env';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
  type UseQueryResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query';
import request from 'graphql-request';
import { useReducer } from 'react';

export function useGraphQLQuery<TResult, TVariables>(
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

interface UseGraphQLQueriesResult<TResult> {
  isPending: boolean;
  data?: TResult[];
  queries: UseQueryResult<TResult>[];
  executeQueries: () => void;
}

export function useGraphQLQueries<TResult, TVariables>(
  queries: Array<{
    document: TypedDocumentNode<TResult, TVariables>;
    variables?: TVariables;
  }>,
): UseGraphQLQueriesResult<TResult> {
  const [enabled, setEnabled] = useReducer(() => true, false);

  const queryResults = useQueries({
    queries: queries.map(({ document, variables }) => ({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      queryKey: [(document as any).definitions[0].name.value, variables],
      enabled,
      queryFn: async ({ queryKey }: { queryKey: unknown[] }) => {
        return await request({
          url: ENDPOINT,
          document,
          variables: queryKey[1] ? queryKey[1] : undefined,
          requestHeaders: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        });
      },
    })),
  });

  const executeQueries = () => {
    if (enabled) {
      queryResults.forEach((query) => query.refetch());
    } else {
      setEnabled();
    }
  };

  const isPending = queryResults.some((query) => query.isLoading);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const data = isPending ? undefined : queryResults.map((query) => query.data!);

  return {
    queries: queryResults,
    isPending,
    data,
    executeQueries,
  };
}
