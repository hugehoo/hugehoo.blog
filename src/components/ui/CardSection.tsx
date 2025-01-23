import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";
import React from "react";
import {CardInterface} from "@/components/ui/MainBlog";
import Link from "next/link";


const CardSection = ({posts}: { posts: CardInterface[] }) => {
  return (
    <div className={styles.teamGrid_Post}>
      {posts.map((post, index) => (
        <Link href={`blog/${post.category}/${decodeURIComponent(post.title)}`}>
          <div key={post.title}
               className={styles.teamMember}>
            <div>
              <div className="flex">
                <span className="text-xl font-semibold">
                - {post.title}
                </span>
                <span className="mr-3"></span>
                <span className="text-s border border-[#333333] rounded-lg px-2">
                {post.category}</span>
              </div>
            </div>
            {/*  /!*<div*!/*/}
            {/*  /!*        // className={styles.underlineTitle}*!/*/}
            {/*  /!*>*!/*/}
            {/*  <img src={post.thumbnail} alt={"alt"}/>*/}
            {/*  /!*</div>*!/*/}
            {/*  /!*<div>*!/*/}
            {/*  /!*  <h4>Read more...</h4>*!/*/}
            {/*  /!*</div>*!/*/}
            {/*</Link>*/}

            {/*<FlipCard*/}
            {/*  frontImage={`${post.thumbnail}`}*/}
            {/*  altText={post.title}*/}
            {/*  backContent={*/}
            {/*    <Link href={`blog/${post.category}/${decodeURIComponent(post.title)}`}>*/}
            {/*      <div>*/}
            {/*        <h4>Read more...</h4>*/}
            {/*        /!*<h4>{post.title}</h4>*!/*/}
            {/*      </div>*/}
            {/*    </Link>*/}
            {/*  }*/}
            {/*  width={400}*/}
            {/*  height={600}*/}
            {/*/>*/}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CardSection;
