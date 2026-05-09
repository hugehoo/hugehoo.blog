import Link from 'next/link';
import { CardInterface } from '@/components/ui/MainBlog';

interface Props {
  posts: CardInterface[];
}

const PostList = ({ posts }: Props) => {
  const visible = posts.filter((p) => p.open);

  if (visible.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
        아직 등록된 글이 없습니다.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {visible.map((post) => (
        <li key={post.title}>
          <Link
            href={`/blog/${post.category}/${decodeURIComponent(post.title)}`}
            className="group block py-7 transition-colors"
          >
            <span className="inline-flex items-center rounded-full border border-blue-600 px-2.5 py-0.5 text-[12px] font-medium text-blue-600 transition-colors dark:border-blue-400 dark:text-blue-400">
              {post.category}
            </span>
            <h2 className="mt-2 text-[22px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400 sm:text-[26px]">
              {post.title}
            </h2>
            {post.summary && (
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                {post.summary}
              </p>
            )}
            <div className="mt-4 text-[13px] text-gray-500 dark:text-gray-500">
              {new Date(post.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
