'use client'

import React, {useState, useEffect} from 'react';
import styles from "@/app/blog/TeamPage.module.css";
import Link from "next/link";

const timePadding = (time: number) => time.toString().padStart(2, '0');

const formatDate = (date: Date) => {
  return `${date.getFullYear()}.${timePadding(date.getMonth() + 1)}.${timePadding(date.getDate())} ${timePadding(date.getHours())}:${timePadding(date.getMinutes())}:${timePadding(date.getSeconds())}`;
};

export const ContentsHeader = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatDate(new Date()));
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={styles.contentHeader}>
      <div className={styles.topHeader}>
        <h1 className={styles.title}>Huge.Hoo Devlog</h1>
        <div className={styles.sideHeader}>
            <Link href="/" className={styles.ctaButton}>Join the Movement</Link>
          {/*<div className={styles.sample}>*/}
          {/*</div>*/}
        </div>
      </div>
      <div className={styles.bottomHeader}>Title: {} Category: {}  {currentTime}
      </div>
    </div>
  );
};
