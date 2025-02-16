import React, { useEffect, useState } from 'react';

interface TOCProps {
  content: string;
}

const TOC = ({ content }: TOCProps) => {
  const [toc, setToc] = useState<string[]>([]);

  useEffect(() => {
    const headings: string[] = [];
    const regex = /^(#{1,3})\s(.+)$/;

    content.split('\n').forEach((line) => {
      const match = regex.exec(line);
      if (match) {
        headings.push(match[2]);
      }
    });

    setToc(headings);
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start', // 제목이 뷰포트 상단에 오도록 설정
      });
    }
  };

  return (
    <div className="toc">
      <h3>Table of Contents</h3>
      <ul>
        {toc.map((heading, index) => {
          const id = heading.replace(/\s+/g, '-').toLowerCase(); // id 형식 맞추기
          return (
            <li key={index}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(id); // 스크롤 이동
                }}
              >
                {heading}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TOC;
