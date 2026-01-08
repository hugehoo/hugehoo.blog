'use client';

import React, { useEffect, useState } from 'react';

interface TOCProps {
  content: string;
}

type matchTitle = {
  index: number;
  title: string;
  id: string;
};

const TOC = ({ content }: TOCProps) => {
  const [toc, setToc] = useState<matchTitle[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings: matchTitle[] = [];
    const regex = /^(#{1,3})\s(.+)$/;
    content.split('\n').forEach((line) => {
      const match = regex.exec(line);
      if (match) {
        const title = match[2];
        const id = title.replace(/\s+/g, '-').toLowerCase();
        headings.push({
          index: match[1].length,
          title: title,
          id: id,
        });
      }
    });

    setToc(headings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -70% 0%',
      }
    );

    const headingElements = toc.map((heading) => 
      document.getElementById(heading.id)
    ).filter(Boolean);

    headingElements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className="toc-container">
      <ul className="toc-list">
        {toc.map((heading) => {
          const isActive = activeId === heading.id;
          const levelClass = `toc-item toc-item-h${heading.index}`;

          return (
            <li key={heading.id} className={levelClass}>
              <a
                href={`#${heading.id}`}
                className={`toc-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(heading.id);
                }}
              >
                {heading.title.replace(/<[^>]*>|[*_~`]/g, '')}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TOC;
