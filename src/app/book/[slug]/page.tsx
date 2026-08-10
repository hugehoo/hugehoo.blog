import { notFound } from 'next/navigation';

import PostMarkdown from '@/app/blog/[category]/[post-name]/postMarkdown';
import { getBook, getBooks } from '@/lib/book';

interface Props {
  params: { slug: string };
}

export const generateStaticParams = () =>
  getBooks().map(({ slug }) => ({ slug }));

export default function BookDetailPage({ params }: Props) {
  const book = getBook(params.slug);

  if (!book) notFound();

  return (
    <PostMarkdown
      params={{
        decodedTitle: book.title,
        content: book.content,
        date: book.date,
        bookInfo: {
          author: book.author,
          publisher: book.publisher,
          publicationYear: book.publicationYear,
          originalTitle: book.originalTitle,
        },
      }}
    />
  );
}
