import styles from '../../TeamPage.module.css';
import path from 'path';
import { sync } from 'glob';
import fs from 'fs';
import matter from 'gray-matter';
import PostMarkdown from '@/app/blog/[category]/[post-name]/postMarkdown';

// Type definitions
interface RouteParams {
  category: string;
  'post-name': string;
  thumbnail?: string;
  content?: string;
  date?: string;
}

interface Props {
  params: RouteParams;
}

interface PostFrontmatter {
  title: string;
  date: string;
  category?: string;
  thumbnail?: string;
  [key: string]: any;
}

interface Post {
  data: PostFrontmatter;
  content: string;
}

// Constants
const POSTS_PATH = path.join(process.cwd(), '/src/posts');
const DEFAULT_POST: Post = {
  data: {
    title: 'Not Found',
    date: new Date().toISOString().split('T')[0], // Today's date as fallback
  },
  content: 'The requested post was not found.',
};

const findPostByTitle = (title: string): Post => {
  if (!title) return DEFAULT_POST;

  try {
    const folderPath = path.join(POSTS_PATH, '**');
    const mdxFiles = sync(`${folderPath}/*.mdx`);

    for (const filePath of mdxFiles) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      const postData = data as PostFrontmatter;

      if (postData.title === title) {
        return { data: postData, content };
      }
    }

    return DEFAULT_POST;
  } catch (error) {
    console.error('Error finding post:', error);
    return DEFAULT_POST;
  }
};

const Post = ({ params }: Props) => {
  const { category, 'post-name': encodedTitle } = params;
  const decodedTitle = decodeURIComponent(encodedTitle);

  const post = findPostByTitle(decodedTitle);
  const postDate = post?.data?.date ? new Date(post.data.date) : new Date();

  return (
    <>
      <div className={`${styles.textContainer} blog-layout-container`}>
        <div className={styles.wrapper}>
          <PostMarkdown
            params={{
              decodedTitle,
              content: post.content,
              date: postDate,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Post;
