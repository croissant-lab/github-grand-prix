import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub Grand Prix',
  description: 'Aggregate GitHub Activity',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
