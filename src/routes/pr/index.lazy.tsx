import { PullRequest } from '@/src/pages/PullRequest';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/pr/')({
  component: PullRequest,
});
