import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Header} from "@/layouts/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
    <body className='font-pretendard flex min-h-screen flex-col'>
    <Header/>
    <main className='mt-[64px] flex flex-1 flex-col'>{children}</main>
    </body>
    </html>
  );
}
