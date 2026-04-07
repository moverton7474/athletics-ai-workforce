import type { ReactNode } from 'react';
import { AppShell } from '../components/layout/AppShell';

export const metadata = {
  title: 'athletics-ai-workforce',
  description: 'Marblism-style AI workforce platform for athletics and beyond.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
