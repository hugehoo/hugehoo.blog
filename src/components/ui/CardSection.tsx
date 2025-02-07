import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";
import React from "react";
import {CardInterface} from "@/components/ui/MainBlog";
import Link from "next/link";


const CardSection = ({posts}: { posts: CardInterface[] }) => {
  return (
    <div className={styles.teamGrid_Post}>
      {
        posts.filter(post => post.open)
        .map((post, index) => ( 
        <Link key={index} href={`blog/${post.category}/${decodeURIComponent(post.title)}`}>
          <div key={post.title}
               className={styles.teamMember}>
            <div>
              <div className="flex">
                <span className="text-xl font-semibold">
                  ⚡️ {post.title}
                </span>
                <span className="mr-3"> </span>
                <div className="h-1px text-[#FF1493] text-[13px] border-pink-500 bg-red-100/50 m-1 rounded-lg px-2 flex items-center">
                  {post.category}
                </div>
              </div>
              <div className="flex text-m mt-3">
                <p>💭 {post.summary}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CardSection;
