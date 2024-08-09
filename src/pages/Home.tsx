import { Link } from '@tanstack/react-router';

export const Home = () => {
  return (
    <main>
      <h1>GitHub Grand Prix</h1>
      <nav>
        <ul>
          <li>
            <Link to="/pr">PR</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};
