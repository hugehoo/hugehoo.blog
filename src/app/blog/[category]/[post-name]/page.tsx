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

const Post = ({params}: Props) => {
  const {category, 'post-name': title, thumbnail, content} = params
  let decodedTitle = decodeURIComponent(title);
  const POSTS_PATH = path.join(process.cwd(), '/src/posts');
  const folder = '**';
  const postPaths = sync(`${POSTS_PATH}/${folder}/*.mdx`);
  let filter = postPaths.map(post => {
    const file = fs.readFileSync(post, 'utf8');
    const {data, content} = matter(file);
    return {data, content}
  }).filter(data => data.data.title === decodedTitle);

  const mdx = filter[0]
  return (
    <div className={styles.textContainer}>
      <h1>Category: {category}</h1>
      <h2>Title: {decodedTitle}</h2>
      <PostMarkdown params={{decodedTitle, content: mdx.content}}/>
    </div>
  )
}

export default Post;
