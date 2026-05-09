import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const buildHref = (basePath: string, page: number) =>
  page === 1 ? basePath : `${basePath}?page=${page}`;

const buildPageList = (current: number, total: number): (number | 'gap')[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('gap');
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push('gap');
  pages.push(total);
  return pages;
};

const numberClass = (active: boolean) =>
  `inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-[13px] font-medium transition-colors ${
    active
      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
  }`;

const arrowClass = (disabled: boolean) =>
  `inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
    disabled
      ? 'pointer-events-none text-gray-300 dark:text-gray-700'
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
  }`;

const Pagination = ({ currentPage, totalPages, basePath }: Props) => {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="페이지네이션"
      className="mt-12 flex items-center justify-center gap-1"
    >
      <Link
        href={buildHref(basePath, currentPage - 1)}
        className={arrowClass(prevDisabled)}
        aria-label="이전 페이지"
        aria-disabled={prevDisabled}
      >
        <ChevronLeft size={16} />
      </Link>
      {pages.map((p, idx) =>
        p === 'gap' ? (
          <span
            key={`gap-${idx}`}
            className="px-1 text-[13px] text-gray-400 dark:text-gray-600"
          >
            ···
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, p)}
            className={numberClass(p === currentPage)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}
      <Link
        href={buildHref(basePath, currentPage + 1)}
        className={arrowClass(nextDisabled)}
        aria-label="다음 페이지"
        aria-disabled={nextDisabled}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
};

export default Pagination;
