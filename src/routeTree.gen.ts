/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const PullRequestIndexLazyImport = createFileRoute('/pullRequest/')()
const PullRequestTimeUntilApproveIndexLazyImport = createFileRoute(
  '/pullRequest/timeUntilApprove/',
)()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PullRequestIndexLazyRoute = PullRequestIndexLazyImport.update({
  path: '/pullRequest/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/pullRequest/index.lazy').then((d) => d.Route),
)

const PullRequestTimeUntilApproveIndexLazyRoute =
  PullRequestTimeUntilApproveIndexLazyImport.update({
    path: '/pullRequest/timeUntilApprove/',
    getParentRoute: () => rootRoute,
  } as any).lazy(() =>
    import('./routes/pullRequest/timeUntilApprove/index.lazy').then(
      (d) => d.Route,
    ),
  )

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/pullRequest/': {
      id: '/pullRequest/'
      path: '/pullRequest'
      fullPath: '/pullRequest'
      preLoaderRoute: typeof PullRequestIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/pullRequest/timeUntilApprove/': {
      id: '/pullRequest/timeUntilApprove/'
      path: '/pullRequest/timeUntilApprove'
      fullPath: '/pullRequest/timeUntilApprove'
      preLoaderRoute: typeof PullRequestTimeUntilApproveIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  PullRequestIndexLazyRoute,
  PullRequestTimeUntilApproveIndexLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/pullRequest/",
        "/pullRequest/timeUntilApprove/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/pullRequest/": {
      "filePath": "pullRequest/index.lazy.tsx"
    },
    "/pullRequest/timeUntilApprove/": {
      "filePath": "pullRequest/timeUntilApprove/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
