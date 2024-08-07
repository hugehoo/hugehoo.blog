import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";
import React from "react";
import {CardInterface} from "@/components/ui/MainBlog";
import Link from "next/link";



// const CardSection = (posts: CardInterface[]) => {
const CardSection = ({posts}: { posts: CardInterface[] }) => {
  return (
    <div className={styles.teamGrid}>
      {posts.map((post, index) => (
        <div key={post.title}
             className={styles.teamMember}
        >
          <div className={styles.underlineTitle}>
            <h3>{post.title}</h3>
          </div>
          <FlipCard
            frontImage={`${post.thumbnail}`}
            altText={post.title}
            backContent={
              <Link href={`blog/tech/${post.title}`}>
                <div>
                  <h4>{post.title}</h4>
                  {/*<p>{post.role}</p>*/}
                </div>
              </Link>
            }
            width={400}
            height={600}
          />
        </div>
      ))}
    </div>
  );
}

export default CardSection;
