'use client';

import './globals.css';
import { IBM_Plex_Sans_KR, IBM_Plex_Sans } from 'next/font/google';
import Head from 'next/head';
import { Header } from '@/layouts/Header';
import { Bottom } from '@/layouts/Bottom';
import styles from '@/app/blog/TeamPage.module.css';
import { useSelectedLayoutSegments } from 'next/navigation';
import { ThemeProvider } from 'next-themes';

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-kr',
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let segment: string[] = useSelectedLayoutSegments();

  return (
    <html
      lang="en"
      className={`${ibmPlexSansKr.variable} ${ibmPlexSans.variable}`}
    >
      <Head>
        <meta
          name="description"
          content="Our team building a world of positive consumption"
        />
        <link rel="icon" href="/src/app/favicon.ico" />
      </Head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className={styles.container}>
            <main className={styles.main}>
              <Header />
              {children}
              <Bottom />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
