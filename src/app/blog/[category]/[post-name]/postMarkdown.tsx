import ReactMarkdown from "react-markdown";
import Image from "next/image";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {base16AteliersulphurpoolLight, nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import {obsidian} from "react-syntax-highlighter/dist/cjs/styles/hljs";

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
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 style={{color: '#111', fontSize: '2em', margin: '2.5em 0 1em 0'}} {...props} />,
          h2: ({node, ...props}) => <h2 style={{color: '#111', fontSize: '1.8em', margin: '2em 0 1em 0'}} {...props} />,
          h3: ({node, ...props}) => <h3 style={{color: '#111', fontSize: '1.6em', margin: '2em 0 1em 0'}} {...props} />,
          h4: ({node, ...props}) => <h4 style={{color: '#111', fontSize: '1.4em'}} {...props} />,
          h5: ({node, ...props}) => <h5 style={{color: '#111', fontSize: '1.2em'}} {...props} />,
          h6: ({node, ...props}) => <h6 style={{color: '#111', fontSize: '1em'}} {...props} />,
          p: ({node, ...props}) => <p style={{marginBottom: '1em'}} {...props} />,
          img: ({src, alt}) => {
            const imagePath = `/posts/${decodedTitle}/${src}`;
            return (
              <span style={{
                display: 'block',
                position: 'relative',
                width: '100%'
              }}>
                <Image
                  src={imagePath}
                  alt={alt || "Post image"}
                  unoptimized={true}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '80%', height: 'auto' }}
                />
              </span>
            );
          },

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

          // code({node, inline, className, children, ...props}) {
          //   const match = /language-(\w+)/.exec(className || '');
          //
          //   if (inline) {
          //     // 인라인 코드(백틱) 스타일링
          //     return (
          //       <code
          //         style={{
          //           backgroundColor: '#e7e7e7',
          //           color: '#d6336c',
          //           padding: '0.2em 0.4em',
          //           borderRadius: '3px',
          //           border: '3px',
          //           fontSize: '9em',
          //         }}
          //         {...props}
          //       >
          //         {children}
          //       </code>
          //     );
          //   } else if (match) {
          //     // 코드 블록 스타일링
          //     return (
          //       <CodeBlock
          //         language={match[1]}
          //         value={String(children).replace(/\n$/, '')}
          //         {...props}
          //       />
          //     );
          //   } else {
          //     return (
          //       <code className={className} {...props}>
          //         {children}
          //       </code>
          //     );
          //   }
          // },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
export default PostMarkdown;
