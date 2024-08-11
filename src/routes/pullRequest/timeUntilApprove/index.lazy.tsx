import { PullRequestUntilApprove } from '@/src/pages/PullRequestUntilApprove';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/pullRequest/timeUntilApprove/')({
  component: PullRequestUntilApprove,
});
