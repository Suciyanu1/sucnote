import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'SucNote — Minimalist Workspace',
  description: 'Distraction-free workspace for thoughts, notes, and projects.',
  openGraph: {
    title: 'SucNote — Minimalist Workspace',
    description: 'Distraction-free workspace for thoughts, notes, and projects.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

