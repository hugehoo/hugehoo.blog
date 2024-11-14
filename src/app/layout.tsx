'use client'

import "./globals.css";
import {Playfair_Display, Song_Myung} from 'next/font/google'
import localFont from 'next/font/local'
import Head from "next/head";
import Blog from "./blog/(main)/page"
import {Header} from "@/layouts/Header";
import {Bottom} from "@/layouts/Bottom";
import styles from "@/app/blog/TeamPage.module.css";
import {useSelectedLayoutSegments} from "next/navigation";
import {ContentsHeader} from "@/layouts/ContentsHeader";

const fogsta = localFont({
  src: '../../public/fonts/Fogsta Italic.woff2',
  display: 'swap',
})

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  let segment: string[] = useSelectedLayoutSegments();
  console.log('📌', segment)

  return (
    <html lang="en" className={fogsta.className}>
    <Head>
      <title>Tech Blog Team Page</title>
      <meta name="description" content="Our team building a world of positive consumption"/>
      <link rel="icon" href="/src/app/favicon.ico"/>
    </Head>
    <body>
    {/*<Blog/>*/}

    <div className={styles.container}>
      <main className={styles.main}>
        {segment.length == 0 ? <Header/> : <ContentsHeader/>}
        {children}
        <Bottom/>
      </main>
    </div>
    </body>
    </html>
  );
}
