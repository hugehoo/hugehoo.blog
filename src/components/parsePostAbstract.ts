import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import {sync} from "glob";
import {CategoryDetail, Post, PostMatter} from "@/config/types";

const BASE_PATH = '/src/posts';
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

// MDX 파일 파싱 : abstract / detail 구분
const parsePost = async (postPath: string): Promise<Post> => {
  const postAbstract = parsePostAbstract(postPath);
  const postDetail = await parsePostDetail(postPath);
  return {categoryPath: "", categoryPublicName: "", ...postAbstract, ...postDetail};
};

// MDX Abstract
// url, cg path, cg name, slug
export const parsePostAbstract = (postPath: string) => {
  // category1/title1/content
  const filePath = postPath
    .slice(postPath.indexOf(BASE_PATH))
    .replace(`${BASE_PATH}/`, '')
    .replace('.mdx', '');

  // category1, title1
  const [category, slug] = filePath.split('/');

  // /blog/category1/title1
  const url = `/blog/${`golang`}/${slug}`;

  return {url, category, slug};
};

// MDX Detail
const parsePostDetail = async (postPath: string) => {
  const file = fs.readFileSync(postPath, 'utf8');
  const {data, content} = matter(file);
  const grayMatter = data as PostMatter;
  const readingMinutes = Math.ceil(readingTime(content).minutes);
  const dateString = dayjs(grayMatter.date).locale('ko').format('YYYY년 MM월 DD일');
  return {...grayMatter, dateString, content, readingMinutes};
};


// 모든 MDX 파일 조회
export const getPostPaths = (category?: string) => {
  const folder = category || '**';
  return sync(`${POSTS_PATH}/${folder}/**/*.mdx`);
};

// 모든 포스트 목록 조회
export const getPostList = async (category?: string): Promise<Post[]> => {
  const paths: string[] = getPostPaths(category);
  return await Promise.all(paths.map((postPath) => parsePost(postPath)));
};

export const getCategoryPublicName = (dirPath: string) => {
  console.log("---------", dirPath)

  return dirPath.split('_')
    .map((token) => token[0]?.toUpperCase() + token.slice(1, token.length))
    .join(' ');
}

export const getAllPostCount = async () => (await getPostList()).length;

export const getCategoryDetailList = async () => {
  const result: { [key: string]: number } = {};
  const posts = await getPostList();
  for (const post of posts) {
    const category = post.categoryPath;
    if (result[category]) {
      result[category] += 1;
    } else {
      result[category] = 1
    }
  }

  console.log("result: ", result);

  const detailList: CategoryDetail[] = Object.entries(result)
    .map(([category, count]) => ({
      dirName: category,
      publicName: getCategoryPublicName(category),
      count,
    }));
  return detailList;
}
