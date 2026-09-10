import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import PostMarkdown from '@/app/blog/[category]/[post-name]/postMarkdown';
import {
  getBook,
  getBookByLegacySlug,
  getBookHref,
  getBooks,
} from '@/lib/book';
import { getAbsoluteUrl } from '@/lib/site';

interface Props {
  params: { slug: string };
}

export const generateStaticParams = () =>
  getBooks().map(({ slug }) => ({ slug }));

export const generateMetadata = ({ params }: Props): Metadata => {
  const book = getBook(params.slug);
  if (!book) return {};

  const canonicalUrl = getAbsoluteUrl(getBookHref(book.slug));
  return {
    title: book.title,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: book.title,
      url: canonicalUrl,
      publishedTime: book.date.toISOString(),
    },
    twitter: {
      card: 'summary',
      title: book.title,
    },
  };
};

export default function BookDetailPage({ params }: Props) {
  const book = getBook(params.slug);

  if (!book) {
    const legacyBook = getBookByLegacySlug(params.slug);
    if (legacyBook) permanentRedirect(getBookHref(legacyBook.slug));
    notFound();
  }

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
