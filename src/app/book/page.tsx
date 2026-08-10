import Link from 'next/link';

import { getBooks } from '@/lib/book';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export default function BookPage() {
  const books = getBooks();

  return (
    <section className="min-h-[75vh] pb-16">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        Book
      </h1>

      {books.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
          아직 등록된 독서 기록이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {books.map((book) => (
            <li key={book.slug}>
              <Link
                href={`/book/${encodeURIComponent(book.slug)}`}
                className="group grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={book.date.toISOString().slice(0, 10)}
                  className="text-[13px] text-gray-500 dark:text-gray-500"
                >
                  {dateFormatter.format(book.date)}
                </time>
                <h2 className="text-[17px] font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                  {book.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
