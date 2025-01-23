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

const nanumSquare = localFont({
  src: [
    {
      path: '../../public/fonts/NanumSquareNeoTTF-bRg.woff',
      weight: '700',
      style: 'bold',
    },
  ],
  variable: '--font-nanum-square',
})

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  let segment: string[] = useSelectedLayoutSegments();
  console.log('📌', segment)

  return (
    <html lang="en" className={nanumSquare.className}>
    <Head>
      <title>Tech Blog Team Page</title>
      <meta name="description" content="Our team building a world of positive consumption"/>
      <link rel="icon" href="/src/app/favicon.ico"/>
    </Head>
    <body>
    <div className={styles.container}>
      <main className={styles.main}>
        {segment.length == 0 ? <Header/> : <ContentsHeader segment={segment}/>}
        {children}
        <Bottom/>
      </main>
    </div>
    </body>
    </html>
  );
}
