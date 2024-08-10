import { mostCommentedQueryDocument } from '@/src/services/comment/mostCommented';
import { useGraphQL } from '@/src/services/common/useGraphQL';

export const PullRequest = () => {
  const { isLoading, data } = useGraphQL(mostCommentedQueryDocument);

  return (
    <main>
      <h1>GitHub Grand Prix</h1>
      <div>isLoading: {isLoading ? 'true' : 'false'}</div>
      <div>data: {JSON.stringify(data)}</div>
      <nav>
        <ul>
          <li>aa</li>
        </ul>
      </nav>
    </main>
  );
};
