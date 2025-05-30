import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={inter.className}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </SessionProvider>
  );
}