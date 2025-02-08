import styles from '../../TeamPage.module.css'
import path from "path";
import {sync} from "glob";
import fs from "fs";
import matter from "gray-matter";
import PostMarkdown from "@/app/blog/[category]/[post-name]/postMarkdown";


interface Props {
  params: {
    category: string
    'post-name': string
    thumbnail: string
    content: string
  }
}

interface PostData {
  title: string;

  [key: string]: any;
}

interface Post {
  data: PostData;
  content: string;
}


// 기본 Post 객체 정의
const defaultPost: Post = {
  data: {
    title: 'Not Found',
  },
  content: 'The requested post was not found.'
};


const POSTS_PATH = path.join(process.cwd(), '/src/posts');

const findPostByTitle = (decodedTitle: string): Post | undefined => {
  const folderPath = path.join(POSTS_PATH, "**");
  let post = sync(`${folderPath}/*.mdx`)
    .map((filePath): Post => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const {data, content} = matter(fileContent);
      return {data: data as PostData, content};
    })
    .find(post => post.data.title === decodedTitle);
  return post || defaultPost;
};

const Post = ({params}: Props) => {
  const {category, 'post-name': title, thumbnail, content} = params
  let decodedTitle = decodeURIComponent(title);
  const mdx = findPostByTitle(decodedTitle)
  return (
    <div className={styles.textContainer}>
      <div className={`${styles.wrapper}`}>
        <PostMarkdown params={{decodedTitle, content: mdx!!.content}}/>
      </div>
    </div>
  )
}

export default Post;
