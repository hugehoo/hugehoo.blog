import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';


const CodeBlock: React.FC<{ language: string; value: string }> = ({language, value}) => {
  return (
    <SyntaxHighlighter language={language} style={nightOwl}>
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
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 style={{color: '#333', fontSize: '2em'}} {...props} />,
          h2: ({node, ...props}) => <h2 style={{color: '#444', fontSize: '1.8em'}} {...props} />,
          h3: ({node, ...props}) => <h3 style={{color: '#555', fontSize: '1.6em'}} {...props} />,
          h4: ({node, ...props}) => <h4 style={{color: '#666', fontSize: '1.4em'}} {...props} />,
          h5: ({node, ...props}) => <h5 style={{color: '#777', fontSize: '1.2em'}} {...props} />,
          h6: ({node, ...props}) => <h6 style={{color: '#888', fontSize: '1em'}} {...props} />,
          p: ({node, ...props}) => <p style={{marginBottom: '1em'}} {...props} />,
          img: ({src, alt}) => {
            const imagePath = `/posts/${decodedTitle}/${src}`;
            return (
              <div style={{
                position: 'relative', height: '400px',
                // margin: '10px 0'
              }}>
                <Image
                  src={imagePath}
                  alt={alt || "Post image"}
                  unoptimized={true}
                  fill
                  style={{objectFit: 'contain'}}
                />
              </div>
            );
          },

          //@ts-ignore
          code({node, inline, className, children, ...props}) {
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


export default PostMarkdown;
