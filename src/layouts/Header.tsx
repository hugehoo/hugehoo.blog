'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/blog/TeamPage.module.css';
import Link from 'next/link';
import { Github, Linkedin, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { github, iconSize, linkedIn } from '@/lib/constant';
import { useTheme } from 'next-themes';

export const Header = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

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
        <div className="flex text-xl mr-1 items-center">
          <button
            onClick={toggleTheme}
            className="mr-4 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {mounted && (resolvedTheme === 'dark' ? (
              <Sun size={iconSize} />
            ) : (
              <Moon size={iconSize} />
            ))}
          </button>
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
