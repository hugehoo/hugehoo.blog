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
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import './markdown-styles.css';

const getHeadingText = (node: any) => {
  return node!!.children[0] && 'value' in node!!.children[0]
    ? (node!!.children[0] as any).value
    : '';
};

interface Props {
  params: {
    decodedTitle: string;
    category?: string;
    content: string;
    date: Date;
    readingMinutes?: number;
  };
  containerStyles?: any;
}

const PostMarkdown = ({ params, containerStyles }: Props) => {
  const { decodedTitle, category, content, date, readingMinutes } = params;
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
      <div className="code-block-wrapper">
        <div className="code-block-header">
          <div className="code-block-dots">
            <span />
            <span />
            <span />
          </div>
          <span className="code-block-lang">{language}</span>
        </div>
        <SyntaxHighlighter
          language={language}
          style={syntaxTheme}
          customStyle={{ margin: 0, borderRadius: 0, border: 'none' }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <>
      <title>{decodedTitle}</title>
      <header className="mb-12 border-b border-gray-100 pb-10 dark:border-gray-800">
        {category && (
          <div className="mb-3 text-[13px] font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {category}
          </div>
        )}
        <h1 className="text-[28px] font-bold leading-[1.25] tracking-tight text-gray-900 dark:text-gray-50 sm:text-[36px]">
          {decodedTitle}
        </h1>
        <div className="mt-5 flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-500">
          <span>
            {date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {readingMinutes ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes}분 읽기</span>
            </>
          ) : null}
        </div>
      </header>

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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '2.25em 0 0.75em 0',
                    letterSpacing: '-0.01em',
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
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    margin: '1.75em 0 0.5em 0',
                    letterSpacing: '-0.01em',
                  }}
                  {...props}
                />
              );
            },
            h4: ({ node, ...props }) => (
              <h4
                className="md-heading"
                style={{
                  fontSize: '1.2em',
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
                  fontSize: '1rem',
                  lineHeight: '1.8',
                  marginBottom: '0.4em',
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
                style={{ fontWeight: '600' }}
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                style={{
                  fontSize: '1rem',
                  marginBottom: '1.25em',
                  lineHeight: '1.8',
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
                  <Zoom
                    wrapElement="span"
                    {...({
                      wrapStyle: { display: 'inline-block', width: '80%' },
                    } as any)}
                  >
                    <Image
                      src={imagePath}
                      alt={alt || 'Post image'}
                      unoptimized={true}
                      width={0}
                      height={0}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '0.3em',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Zoom>
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
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => <tr className="md-tr" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </>
  );
};
export default PostMarkdown;
