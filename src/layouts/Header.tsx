'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/blog/TeamPage.module.css';
import Link from 'next/link';
import { Github, Linkedin, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { github, linkedIn } from '@/lib/constant';
import { useTheme } from 'next-themes';

const ICON_SIZE = 18;

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

  const navLink = (href: string, label: string) => {
    const isActive =
      href === '/' ? pathname === '/' : pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={`text-[15px] transition-colors ${
          isActive
            ? 'font-semibold text-gray-900 dark:text-gray-50'
            : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <Link href="/">
          <div className={styles.title}>huge.hoo</div>
        </Link>
      </div>
      <div className={styles.navStyle}>
        <nav className="flex items-center gap-5">
          {navLink('/blog', 'Blog')}
          {navLink('/about', 'About')}
        </nav>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <button
            onClick={toggleTheme}
            className="rounded-md p-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Toggle dark mode"
          >
            {mounted &&
              (resolvedTheme === 'dark' ? (
                <Sun size={ICON_SIZE} />
              ) : (
                <Moon size={ICON_SIZE} />
              ))}
          </button>
          <a
            href={github}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="GitHub"
          >
            <Github size={ICON_SIZE} />
          </a>
          <a
            href={linkedIn}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="LinkedIn"
          >
            <Linkedin size={ICON_SIZE} />
          </a>
        </div>
      </div>
    </header>
  );
};
