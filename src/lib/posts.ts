import fs from 'fs';
import path from 'path';
import { sync } from 'glob';
import matter from 'gray-matter';

export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: Date | string;
  category: string;
  desc?: string;
  thumbnail?: string;
  open?: boolean;
}

export interface PostDocument {
  data: PostFrontmatter;
  content: string;
  filePath: string;
}

const POSTS_PATH = path.join(process.cwd(), 'src/posts');

export const isValidPostSlug = (slug: string) => POST_SLUG_PATTERN.test(slug);

export const getPostDocuments = (): PostDocument[] => {
  const posts = sync(`${POSTS_PATH}/**/*.mdx`).map((filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      data: data as PostFrontmatter,
      content,
      filePath,
    };
  });

  const seenSlugs = new Map<string, string>();
  for (const post of posts) {
    const { slug, title } = post.data;
    if (!slug || !isValidPostSlug(slug)) {
      throw new Error(
        `Post "${title || post.filePath}" has an invalid slug: "${slug || ''}"`
      );
    }

    const duplicatePath = seenSlugs.get(slug);
    if (duplicatePath) {
      throw new Error(
        `Duplicate post slug "${slug}" in ${duplicatePath} and ${post.filePath}`
      );
    }
    seenSlugs.set(slug, post.filePath);
  }

  return posts;
};

export const findPostBySlug = (slug: string) =>
  getPostDocuments().find((post) => post.data.slug === slug);

export const findPostByLegacyPath = (category: string, title: string) =>
  getPostDocuments().find(
    (post) => post.data.category === category && post.data.title === title
  );
