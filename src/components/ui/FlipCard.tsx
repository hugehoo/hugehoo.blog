'use client'

import React, {useState} from 'react';
import Image from 'next/image';
import styles from './FlipCard.module.css';

interface FlipCardProps {
  frontImage: string;
  altText: string;
  backContent: React.ReactNode;
  width: number;
  height: number;
}

const FlipCard: React.FC<FlipCardProps> = ({frontImage, altText, backContent, width, height}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  return (
    <div
      className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      style={{
        width: '100%',
        height: '400px'
      }}
    >
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          {/*<div style={{height: '300px', background: 'red'}}>*/}
          {/*  <h1>hahah</h1>*/}
          {/*</div>*/}
          <Image src={frontImage}
                 alt={altText}
                 fill
          />
        </div>
        <div className={styles.flipCardBack}>
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
