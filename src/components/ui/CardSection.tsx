import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";
import React from "react";
import {CardInterface} from "@/components/ui/MainBlog";



// const CardSection = (posts: CardInterface[]) => {
const CardSection = ({posts}: { posts: CardInterface[] }) => {
  return (
    <div className={styles.teamGrid}>
      {posts.map((member, index) => (
        <div key={member.name}
             className={styles.teamMember}
        >
          <div className={styles.underlineTitle}>
            <h3>{member.name}</h3>
          </div>
          <FlipCard
            frontImage={`/team-member-${index + 1}.jpeg`}
            altText={member.name}
            backContent={
              <div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
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
