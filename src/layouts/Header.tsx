'use client'

import React, {useState, useEffect} from 'react';
import styles from "@/app/blog/TeamPage.module.css";
import Link from "next/link";
import { Github, Linkedin } from 'lucide-react';

const linkedIn = 'https://www.linkedin.com/in/%EC%84%B1%ED%9B%84-%EC%9E%84-7a2238195/'
const github= 'https://github.com/hugehoo'
const iconSize = 27

export const Header = () => {
  const [currentTime, setCurrentTime] = useState('');

  return (
    <div className={`${styles.header} font-[var(--font-ibm-plex-kr)]`}> 
        <div className={styles.headerTitle}>
          <Link href="/">
            <div className={styles.title}>huge.hoo</div>
          </Link>
        </div>
        <div className={styles.navStyle}>
          <nav className='text-xl'>
            <Link className='mr-4' href="/blog">Blog</Link>
            <Link  className='mr-4' href="/about">About</Link>
          </nav>
          <div className='flex text-xl mr-1'>
            <a href={github} className="mr-4">
              <Github size={iconSize} />
            </a>
            <a href={linkedIn} className="">
              <Linkedin size={iconSize} />
            </a>
          </div>
        </div>
      </div>
  );
};
