import { Home } from '@/src/pages/Home';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Home,
});
