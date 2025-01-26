import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {base16AteliersulphurpoolLight, nightOwl, prism, oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";

const CodeBlock: React.FC<{ language: string; value: string }> = ({language, value}) => {
  return (
    <SyntaxHighlighter language={language} style={oneDark} className="language-bash hljs">
      {value}
    </SyntaxHighlighter>
  );
};

interface Props {
  params: {
    decodedTitle: string
    content: string
  }
}

const PostMarkdown = ({params}: Props) => {
  const {decodedTitle, content} = params
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) =>
            <h1 style={{color: '#111', fontSize: '2em', margin: '2.5em 0 1em 0'}} {...props} />,
          h2: ({node, ...props}) =>
            <h2 style={{color: '#111', fontSize: '1.8em', fontWeight: '900', margin: '1.5em 0 0.3em 0'}} {...props} />,
          h3: ({node, ...props}) =>
            <h3 style={{color: '#111', fontSize: '1.6em', fontWeight: '900', margin: '2em 0 0.5em 0'}} {...props} />,
          h4: ({node, ...props}) =>
            <h4 style={{color: '#111', fontSize: '1.4em', margin: '2em 0 0.5em 0'}} {...props} />,
          h5: ({node, ...props}) =>
            <h5 style={{color: '#111', fontSize: '1.2em', margin: '2em 0 0.5em 0'}} {...props} />,
          h6: ({node, ...props}) =>
            <h6 style={{color: '#111', fontSize: '1em'}} {...props} />,
          ol: ({node, ...props}) =>
            <ol style={{color: '#111', marginLeft: '1.2em', listStyleType: 'decimal',}} {...props} />,
          li: ({node, ...props}) =>
            <li style={{color: '#111', marginLeft: '0.5em'}} {...props} />,
          ul: ({node, ...props}) =>
            <ul style={{color: '#111', marginLeft: '0.5em', listStyleType: 'disc',}} {...props} />,
          strong: ({node, ...props}) =>
            <strong style={{color: '#111', background: '#fff3b9'}} {...props} />,
          p: ({node, ...props}) =>
            <p style={{
              fontSize: '0.95em',
              marginBottom: '0.5em',
              lineHeight: '1.7em'
            }} {...props} />,
          a: ({href, ...props}) =>
            <a href={href} style={{color: '#3498db'}} {...props} />,
          br: ({node, ...props}) =>
            <br {...props} />, img: ({src, alt}) => {
            const imagePath = `/posts/${decodedTitle}/${src}`;
            return (
              <span style={{
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
                margin: '1.5em 0',
                width: '100%',
              }}>
                <Image
                  src={imagePath}
                  alt={alt || "Post image"}
                  unoptimized={true}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{width: '80%', height: 'auto'}}
                />
              </span>
            );
          },
          blockquote: ({node, ...props}) => (
            <blockquote
              style={{
                color: '#555',
                // fontStyle: 'italic',
                padding: '1em 1em 1em 1em',
                borderLeft: '4px solid #ccc',
                backgroundColor: '#f9f9f9',
                margin: '1em 0',
              }}
              {...props}
            />
          ),
          // @ts-ignore
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            ) : (
              <code className='code-inline' {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
export default PostMarkdown;
