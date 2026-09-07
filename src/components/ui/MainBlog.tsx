import dayjs from 'dayjs';
import PostList from '@/components/post_list/PostList';
import CategoryChips, {
  CategoryChip,
} from '@/components/post_list/CategoryChips';
import Pagination from '@/components/post_list/Pagination';
import { getPostDocuments } from '@/lib/posts';

export interface CardInterface {
  title: string;
  slug: string;
  thumbnail?: string;
  category: string;
  content: string;
  summary: string;
  date: Date;
  open: boolean;
}

const POSTS_PER_PAGE = 10;

const getPosts = (): CardInterface[] => {
  return getPostDocuments()
    .map(({ data, content }) => {
      return {
        title: data.title,
        slug: data.slug,
        date: new Date(data.date),
        thumbnail: data.thumbnail,
        category: data.category,
        summary: data.desc || '',
        content,
        open: data.open ?? false,
      };
    })
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};

const buildChips = (posts: CardInterface[]): CategoryChip[] => {
  const counts = new Map<string, number>();
  for (const post of posts) {
    if (!post.open || !post.category) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

interface Props {
  category?: string;
  page?: number;
  basePath?: string;
}

const MainBlog = ({ category, page = 1, basePath = '/blog' }: Props) => {
  const allPosts = getPosts();
  const chips = buildChips(allPosts);
  const total = allPosts.filter((p) => p.open).length;

  const filtered = (
    category ? allPosts.filter((p) => p.category === category) : allPosts
  ).filter((p) => p.open);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const pageItems = filtered.slice(start, start + POSTS_PER_PAGE);

  return (
    <section className="min-h-[75vh] pb-16">
      <CategoryChips chips={chips} total={total} currentCategory={category} />
      <PostList posts={pageItems} />
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </section>
  );
};

export default MainBlog;
