import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/pullRequest/')({
  component: () => <div>Hello /pullRequest/!</div>,
});
