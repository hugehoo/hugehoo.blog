import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import CardSection from '@/components/ui/CardSection';
import styles from '@/app/blog/TeamPage.module.css';
import { sync } from 'glob';
import dayjs from 'dayjs';

export interface CardInterface {
  title: string;
  thumbnail: string;
  category: string;
  content: string;
  summary: string;
  date: Date;
  open: boolean;
}

const getPosts = (): CardInterface[] => {
  const POSTS_PATH = path.join(process.cwd(), '/src/posts');
  const folder = '**';
  const postPaths: string[] = sync(`${POSTS_PATH}/${folder}/**/*.mdx`);

  return postPaths
    .map((post) => {
      const file = fs.readFileSync(post, 'utf8');
      const { data, content } = matter(file);

      return {
        title: data.title,
        date: data.date,
        thumbnail: data.thumbnail,
        category: data.category,
        summary: data.desc,
        content: content,
        open: data.open,
      };
    })
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};

const MainBlog = () => {
  const posts = getPosts();
  return (
    <section className={styles.teamSection}>
      <CardSection posts={posts} />
    </section>
  );
};

export default MainBlog;
