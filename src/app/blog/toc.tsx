import React, {useEffect, useState} from 'react';

interface TOCProps {
  content: string;
}

type matchTitle= {
  index: number
  title: string
}

const TOC = ({ content }: TOCProps) => {
  const [toc, setToc] = useState<matchTitle[]>([]);
  useEffect(() => {
    const headings: matchTitle[] = [];
    const regex = /^(#{1,3})\s(.+)$/;
    content.split('\n').forEach((line) => {
      const match = regex.exec(line);
      if (match) {
        headings.push({
          index: match[1].length,
          title: match[2]
        });
      }
    });

    setToc(headings);
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="toc">
      <h3>Table of Contents</h3>
      <ul className="list-disc list-inside">
        {toc.map((heading, index) => {
          const id = heading.title.replace(/\s+/g, '-').toLowerCase(); // id 형식 맞추기
          const paddingClass = heading.index === 3 ? "pl-4" : ""; // index가 3일 때만 padding 적용

          return (
              <li key={heading.title} className={paddingClass}>
                <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHeading(id);
                    }}
                >
                  {heading.title}
                </a>
              </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TOC;
