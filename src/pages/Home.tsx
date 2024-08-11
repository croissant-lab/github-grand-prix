import { Link } from '@tanstack/react-router';

export const Home = () => {
  return (
    <main>
      <h1>GitHub Grand Prix</h1>
      <nav>
        <h2>PullRequest</h2>
        <ul>
          <li>
            <Link to="/pullRequest/timeUntilApprove">PR Approveまでの時間</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};
