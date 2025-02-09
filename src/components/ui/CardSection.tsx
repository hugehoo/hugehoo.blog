import styles from '@/app/blog/TeamPage.module.css';
import FlipCard from '@/components/ui/FlipCard';
import React from 'react';
import { CardInterface } from '@/components/ui/MainBlog';
import Link from 'next/link';
import { log } from 'console';

const CardSection = ({ posts }: { posts: CardInterface[] }) => {
  return (
    // grid 레이아웃 적용, 화면 크기에 따라 열 수 조정
    <div className="grid grid-cols-1 gap-4">
      {posts
        .filter((post) => post.open)
        .map((post, index) => (
          <Link
            key={index}
            href={`blog/${post.category}/${decodeURIComponent(post.title)}`}
          >
            {/* 카드 스타일링 */}
            <div
              key={post.title}
              className="p-2 max-md:p-4 rounded-lg border md:border-0 border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="max-md:text-lg sm:text-xl font-semibold break-words">
                    ⚡️ {post.title}
                  </span>
                  <div className="text-[13px] text-pink-500 bg-pink-50 rounded-lg px-2 py-1">
                    {post.category}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                    💭 {post.summary}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default CardSection;
