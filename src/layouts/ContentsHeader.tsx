'use client'

import React, {useState, useEffect} from 'react';
import styles from "@/app/blog/TeamPage.module.css";
import Link from "next/link";

const timePadding = (time: number) => time.toString().padStart(2, '0');

const formatDate = (date: Date) => {
  return `${date.getFullYear()}.${timePadding(date.getMonth() + 1)}.${timePadding(date.getDate())} ${timePadding(date.getHours())}:${timePadding(date.getMinutes())}:${timePadding(date.getSeconds())}`;
};

interface ContentsHeaderProps {
  segment: string[];
}

export const ContentsHeader = ({segment}: ContentsHeaderProps) => {
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => setCurrentTime(formatDate(new Date()));
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const category = segment[1] ? decodeURIComponent(segment[1]) : 'General';
  const title = segment[2] ? decodeURIComponent(segment[2]) : 'Default Title';
  return (
    <div className={styles.contentHeader}>
      <div className={styles.topHeader}>
        <h1 className={styles.title}>Huge.Hoo Devlog</h1>
        <div className={styles.sideHeader}>
          <Link href="/" className={styles.ctaButton}>Join the Movement</Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">
          {title}
        </span>
        <span className="text-[#FF1493] text-[13px] border border-pink-500 bg-red-100/50 rounded-lg px-2 flex items-center">
          {category}
        </span>
      </div>
    </div>
  );
};
