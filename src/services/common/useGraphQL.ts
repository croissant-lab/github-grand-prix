import { ENDPOINT, GITHUB_TOKEN } from '@/src/constants/env';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): UseQueryResult<TResult> {
  return useQuery({
    // biome-ignore lint/suspicious/noExplicitAny: temp
    queryKey: [(document as any).definitions[0].name.value, variables],
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
  });
}
