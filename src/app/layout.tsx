import "./globals.css";
import {Playfair_Display, Song_Myung} from 'next/font/google'
import localFont from 'next/font/local'
import Head from "next/head";
import Blog from "./blog/(main)/page"

const fogsta = localFont({
  src: '../../public/fonts/Fogsta.woff2',
  display: 'swap',
})

const songMyung = Song_Myung({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={fogsta.className}>
    <Head>
      <title>Tech Blog Team Page</title>
      <meta name="description" content="Our team building a world of positive consumption"/>
      <link rel="icon" href="/src/app/favicon.ico"/>
    </Head>
    <body>
    <Blog/>
    </body>
    </html>
  );
}
