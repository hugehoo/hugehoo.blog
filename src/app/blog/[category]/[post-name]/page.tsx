import styles from '../../TeamPage.module.css'
import {GetServerSideProps} from "next";
import path from "path";
import {sync} from "glob";
import fs from "fs";
import matter from "gray-matter";

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
  console.log(decodeURIComponent(title))

  const POSTS_PATH = path.join(process.cwd(), '/src/posts');
  const folder = '**';
  let param = params["post-name"];
  const postPaths = sync(`${POSTS_PATH}/${folder}/*.mdx`);
  let filter = postPaths.map(post => {
    const file = fs.readFileSync(post, 'utf8');
    const {data, content} = matter(file);
    return {data, content}
  }).filter(data => data.data.title === decodeURIComponent(title));
  const mdx = filter[0]
  console.log(mdx)
  return (
    <div className={styles.textContainer}>
      <h1>Category: {category}</h1>
      <h2>Title: {title}</h2>
      <div className={styles.markdownContent}>
      </div>
      {/* 여기에 포스트 내용을 표시하는 로직을 추가합니다 */}
    </div>
  )
}

export default Post;
