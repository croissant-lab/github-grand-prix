{"version":1,"type":"collection","title":"GitHub GraphQL API","queries":[{"version":1,"type":"window","query":"  query MostCommentedQueryDocument($owner: String!, $repo: String!) {\n      repository(owner: $owner, name: $repo) {\n      pullRequests(first: 1, states: MERGED, orderBy: {field: CREATED_AT, direction: DESC},) {\n        nodes {\n          url\n          createdAt\n          closedAt\n          title\n          author{\n            login\n          }\n          reviewDecision\n          reviews(first: 100, states: APPROVED){\n            nodes{\n              state\n              createdAt\n              author{\n                login\n              }\n            }\n          }\n          viewerLatestReviewRequest{\n            asCodeOwner\n          }\n          comments(first: 100) {\n            nodes {\n              author {\n                login\n              }\n              body\n            }\n          }\n        }\n      }\n    }\n  }","apiUrl":"https://api.github.com/graphql","variables":"{\n  \"owner\": \"facebook\",\n  \"repo\": \"react\"\n}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[{"key":"","value":"","enabled":true}],"windowName":"MostCommented","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"80284f09-4983-4dd9-894a-456150f49fae","created_at":1723340684487,"updated_at":1723344931959},{"version":1,"type":"window","query":"query {\n  viewer {\n    login\n  }\n}","apiUrl":"https://api.github.com/graphql","variables":"{}","subscriptionUrl":"","subscriptionConnectionParams":"{}","headers":[],"windowName":"Test","preRequestScript":"","preRequestScriptEnabled":false,"postRequestScript":"","postRequestScriptEnabled":false,"id":"d529c74f-6f56-4d33-8d1a-aa54f9735008","created_at":1723343322179,"updated_at":1723343322179}],"preRequest":{"script":"","enabled":false},"postRequest":{"script":"","enabled":false},"id":"e4c742d3-2f23-41df-b6b9-ab58ea1767fc","parentPath":"","created_at":1723340684464,"updated_at":1723340684464,"collections":[]}