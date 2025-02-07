'use client'

import React, {useState, useEffect} from 'react';
import styles from "@/app/blog/TeamPage.module.css";
import Link from "next/link";
import { Github, Linkedin } from 'lucide-react';

const linkedIn = 'https://www.linkedin.com/in/%EC%84%B1%ED%9B%84-%EC%9E%84-7a2238195/'
const github= 'https://www.linkedin.com/in/%EC%84%B1%ED%9B%84-%EC%9E%84-7a2238195/'

export const Header = () => {
  const [currentTime, setCurrentTime] = useState('');

  return (
    <div className={`${styles.header} font-[var(--font-ibm-plex-kr)]`}> 
        <div className={styles.headerTitle}>
          <Link href="">
            <div className={styles.title}>huge.hoo</div>
          </Link>
          {/* <div className={styles.title}>icon later</div> */}
        </div>
        <div className={styles.navStyle}>
          <nav className='text-xl'>
            <Link className='mr-4' href="">Blog</Link>
            <Link  className='mr-4' href="">About</Link>
          </nav>
          <div className='flex text-xl mr-1'>
            <a href={github} className="mr-4">
              <Github size={28} />
            </a>
            <a href={linkedIn} className="">
              <Linkedin size={28} />
            </a>
          </div>
        </div>
      </div>
  );
};
