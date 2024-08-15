import styles from '../../TeamPage.module.css'
import Image from 'next/image'; // Next.js의 Image 컴포넌트를 사용합니다. 일반 React 프로젝트라면 이 줄을 제거하세요.
import path from "path";
import {sync} from "glob";
import fs from "fs";
import matter from "gray-matter";
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus}>
      {value}
    </SyntaxHighlighter>
  );
};

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
  let param = params["post-name"];
  const postPaths = sync(`${POSTS_PATH}/${folder}/*.mdx`);
  let filter = postPaths.map(post => {
    const file = fs.readFileSync(post, 'utf8');
    const {data, content} = matter(file);
    return {data, content}
  }).filter(data => data.data.title === decodedTitle);
  const mdx = filter[0]
  // console.log("📌", mdx)
  // @ts-ignore
  return (
    <div className={styles.textContainer}>
      <h1>Category: {category}</h1>
      <h2>Title: {decodedTitle}</h2>
      <div className={styles.markdownContent}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img: ({ src, alt, ...props }) => {
              // @ts-ignore
              console.log("⭐️", src)
              return (
                // @ts-ignore
                <Image
                  {...props}
                  src={`${src}`}
                  unoptimized={true}
                  width={500} // 적절한 크기로 조정하세요
                  height={300} // 적절한 크기로 조정하세요
                  alt={alt || ""}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              );
            },
          }}
        >
          {mdx.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default Post;
