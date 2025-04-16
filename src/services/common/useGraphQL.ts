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
        console.log('queryKey');
        let hasNextPage = true;
        let endCursor = '';
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let prNodes: any[] = [];
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const maxFetchCount = (queryKey[1] as any)?.maxFetchCount ?? 3;
        let requestCount = 0;

        const endCursorRequest = async (after = '') =>
          await request({
            url: ENDPOINT,
            document,
            variables: queryKey[1] ? { ...queryKey[1], after } : undefined,
            requestHeaders: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
          });

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const firstRequest = (await endCursorRequest('')) as any;
        hasNextPage = firstRequest.repository.pullRequests.pageInfo.hasNextPage;
        endCursor = firstRequest.repository.pullRequests.pageInfo.endCursor;
        prNodes = firstRequest.repository.pullRequests.nodes;

        while (hasNextPage && endCursor) {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const secondRequest = (await endCursorRequest(endCursor)) as any;
          hasNextPage =
            secondRequest.repository.pullRequests.pageInfo.hasNextPage;
          endCursor = secondRequest.repository.pullRequests.pageInfo.endCursor;

          // console.log(secondRequest);
          // console.log(hasNextPage);
          // console.log(endCursor);

          prNodes = [
            ...prNodes,
            ...secondRequest.repository.pullRequests.nodes,
          ];
          requestCount++;
          if (requestCount >= maxFetchCount - 1) {
            hasNextPage = false;
          }
        }

        const result = {
          ...firstRequest,
          repository: {
            ...firstRequest.repository,
            pullRequests: {
              ...firstRequest.repository.pullRequests,
              nodes: prNodes,
            },
          },
        };

        return result;
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
