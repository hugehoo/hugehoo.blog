'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export interface CategoryChip {
  name: string;
  count: number;
}

interface Props {
  chips: CategoryChip[];
  total: number;
  currentCategory?: string;
}

const baseClass =
  'inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors';
const inactive =
  'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-transparent dark:text-gray-400 dark:hover:text-gray-100';
const active =
  'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900';

const CategoryChips = ({ chips, total, currentCategory }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const isAll = !currentCategory;

  const orderedChips = currentCategory
    ? [
        ...chips.filter((c) => c.name === currentCategory),
        ...chips.filter((c) => c.name !== currentCategory),
      ]
    : chips;

  return (
    <div className="relative mb-10">
      <ul
        className={`flex flex-wrap gap-2 overflow-hidden pr-11 transition-[max-height] duration-300 ease-out ${
          expanded ? 'max-h-[600px]' : 'max-h-[36px]'
        }`}
      >
        <li>
          <Link
            href="/blog"
            className={`${baseClass} ${isAll ? active : inactive}`}
          >
            All
            <span className="ml-1.5 text-[12px] opacity-70">{total}</span>
          </Link>
        </li>
        {orderedChips.map((chip) => {
          const isCurrent = chip.name === currentCategory;
          return (
            <li key={chip.name}>
              <Link
                href={`/blog/${chip.name}`}
                className={`${baseClass} ${isCurrent ? active : inactive}`}
              >
                {chip.name}
                <span className="ml-1.5 text-[12px] opacity-70">
                  {chip.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? '카테고리 접기' : '카테고리 더 보기'}
        aria-expanded={expanded}
        className="absolute right-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-transparent dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
};

export default CategoryChips;
