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
          <Image src={frontImage}
                 alt={altText}
                 layout="fill"
                 objectFit="cover"/>
        </div>
        <div className={styles.flipCardBack}>
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
