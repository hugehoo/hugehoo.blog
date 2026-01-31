'use client';

import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneLight,
  oneDark,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import React from 'react';
import { useTheme } from 'next-themes';

const getHeadingText = (node: any) => {
  return node!!.children[0] && 'value' in node!!.children[0]
    ? (node!!.children[0] as any).value
    : '';
};

interface Props {
  params: {
    decodedTitle: string;
    content: string;
    date: Date;
  };
  containerStyles?: any;
}

const PostMarkdown = ({ params, containerStyles }: Props) => {
  const { decodedTitle, content, date } = params;
  const { resolvedTheme } = useTheme();
  const generateIdFromText = (text: string) => {
    return text.replace(/\s+/g, '-').toLowerCase();
  };

  const syntaxTheme = resolvedTheme === 'dark' ? oneDark : oneLight;

  const CodeBlock: React.FC<{ language: string; value: string }> = ({
    language,
    value,
  }) => {
    return (
      <SyntaxHighlighter
        language={language}
        style={syntaxTheme}
        className="language-bash hljs"
      >
        {value}
      </SyntaxHighlighter>
    );
  };

  return (
    <>
      <title>{decodedTitle}</title>
      <div className="post-meta mb-10">
        <div className="text-4xl font-semibold">{decodedTitle}</div>
        <div className="mt-3">
          <span className="text-gray-500">
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            })}
          </span>
        </div>
      </div>

      <article className="post-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => {
              const headingText = getHeadingText(node);
              return (
                <h1
                  id={generateIdFromText(headingText)}
                  className="md-heading"
                  style={{
                    fontSize: '2em',
                    margin: '1.5em 0 1em 0',
                  }}
                  {...props}
                />
              );
            },
            h2: ({ node, ...props }) => {
              const headingText = getHeadingText(node);
              return (
                <h2
                  id={generateIdFromText(headingText)}
                  className="md-heading"
                  style={{
                    fontSize: '1.7em',
                    fontWeight: '900',
                    margin: '1.5em 0 0.5em 0',
                  }}
                  {...props}
                />
              );
            },
            h3: ({ node, ...props }) => {
              const headingText = getHeadingText(node);
              return (
                <h3
                  id={generateIdFromText(headingText)}
                  className="md-heading"
                  style={{
                    fontSize: '1.5em',
                    fontWeight: '900',
                    margin: '0.3em 0 0.5em 0',
                  }}
                  {...props}
                />
              );
            },
            h4: ({ node, ...props }) => (
              <h4
                className="md-heading"
                style={{
                  fontSize: '1.3em',
                  fontWeight: '600',
                  margin: '1em 0 0.5em 0',
                }}
                {...props}
              />
            ),
            h5: ({ node, ...props }) => (
              <h5
                className="md-heading"
                style={{
                  fontSize: '1.2em',
                  fontWeight: '600',
                  margin: '1em 0 0.5em 0',
                }}
                {...props}
              />
            ),
            h6: ({ node, ...props }) => (
              <h6
                className="md-heading"
                style={{ fontSize: '1em' }}
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                style={{
                  marginLeft: '1.2em',
                  listStyleType: 'decimal',
                }}
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li
                style={{
                  marginLeft: '0.5em',
                  fontSize: '0.95em',
                  lineHeight: '1.9em',
                }}
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                style={{
                  marginLeft: '0.5em',
                  listStyleType: 'disc',
                }}
                {...props}
              />
            ),
            strong: ({ node, ...props }) => (
              <strong
                className="md-strong"
                style={{
                  fontSize: '1em',
                  fontWeight: '600',
                }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                style={{
                  fontSize: '0.99em',
                  marginBottom: '0.5em',
                  lineHeight: '2.1em',
                }}
                {...props}
              />
            ),
            a: ({ href, ...props }) => (
              <a href={href} className="md-link" {...props} />
            ),
            br: ({ node, ...props }) => <br {...props} />,
            img: ({ src, alt }) => {
              const imagePath = `/posts/${decodedTitle}/${src}`;
              return (
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    margin: '2em 0',
                    width: '100%',
                  }}
                >
                  <Image
                    src={imagePath}
                    alt={alt || 'Post image'}
                    unoptimized={true}
                    width={0}
                    height={0}
                    style={{ width: '80%', height: 'auto', borderRadius: '0.3em', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                  />
                </span>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="md-blockquote"
                style={{
                  padding: '0.7em 1em 0.7em 1em',
                  margin: '1em 0',
                }}
                {...props}
              />
            ),
            // @ts-ignore
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className="code-inline" {...props}>
                  {children}
                </code>
              );
            },
            table: ({ node, ...props }) => (
              <table
                className="md-table"
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  margin: '1.5em 0',
                  fontSize: '0.95em',
                }}
                {...props}
              />
            ),
            thead: ({ node, ...props }) => (
              <thead className="md-thead" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th
                className="md-th"
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: '600',
                }}
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="md-td"
                style={{
                  padding: '0.75rem',
                }}
                {...props}
              />
            ),
            tbody: ({ node, ...props }) => (
              <tbody {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr className="md-tr" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </>
  );
};
export default PostMarkdown;
