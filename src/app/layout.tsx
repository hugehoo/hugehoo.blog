import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {TeamPage} from "@/app/blog/TeamPage";
import "./globals.css";
import {Header} from "@/layouts/Header";
import {Playfair_Display, Song_Myung} from 'next/font/google'
import localFont from 'next/font/local'

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
    {/*<body className='fonts-pretendard flex min-h-screen flex-col'>*/}
    {/*<main className='mt-[64px] flex flex-1 flex-col'>{children}</main>*/}
    {/*</body>*/}
    <body>
    <TeamPage/>
    </body>
    </html>
  );
}
