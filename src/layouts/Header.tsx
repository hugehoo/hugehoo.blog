'use client'

import React, {useState, useEffect} from 'react';
import styles from "@/app/blog/TeamPage.module.css";

const timePadding = (time: number) => time.toString().padStart(2, '0');

const formatDate = (date: Date) => {
  return `${date.getFullYear()}.${timePadding(date.getMonth() + 1)}.${timePadding(date.getDate())} ${timePadding(date.getHours())}:${timePadding(date.getMinutes())}:${timePadding(date.getSeconds())}`;
};

export const Header = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatDate(new Date()));
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Developer Hoo</h1>
      <div className={styles.sideHeader}>
        <div className={styles.sample}>
          <a href="#" className={styles.ctaButton}>Join the Movement</a>
        </div>
        <div className={styles.sample}>
          <br/>
          <br/>
          <br/>
          <br/>
          {currentTime}
        </div>
      </div>
    </div>
  );
};
