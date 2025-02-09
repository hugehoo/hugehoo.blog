'use client';

import React from 'react';
import styles from '@/app/blog/TeamPage.module.css';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { github, iconSize, linkedIn } from '@/lib/constant';

export const Header = () => {
  const pathname = usePathname();

  return (
    <div className={`${styles.header} font-[var(--font-ibm-plex-kr)]`}>
      <div className={styles.headerTitle}>
        <Link href="/">
          <div className={styles.title}>huge.hoo</div>
        </Link>
      </div>
      <div className={styles.navStyle}>
        <nav className="text-xl">
          <Link
            className={`mr-4 ${pathname === '/blog' ? 'text-grey-700 font-semibold' : ''}`}
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className={`mr-4 ${pathname === '/about' ? 'text-grey-700 font-semibold' : ''}`}
            href="/about"
          >
            About
          </Link>
        </nav>
        <div className="flex text-xl mr-1">
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
