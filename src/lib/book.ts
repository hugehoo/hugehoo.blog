import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

const BOOKS_PATH = path.join(process.cwd(), 'src/books');

export interface BookRecord {
  slug: string;
  title: string;
  date: Date;
  content: string;
  author?: string;
  publisher?: string;
  publicationYear?: number;
  originalTitle?: string;
}

export const getBooks = (booksPath = BOOKS_PATH): BookRecord[] =>
  fs
    .readdirSync(booksPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => {
      const filePath = path.join(booksPath, entry.name);
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
      const date = new Date(data.date);

      if (typeof data.title !== 'string' || Number.isNaN(date.getTime())) {
        throw new Error(`${filePath} must include valid title and date fields`);
      }

      for (const field of ['author', 'publisher', 'originalTitle'] as const) {
        if (data[field] !== undefined && typeof data[field] !== 'string') {
          throw new Error(`${filePath}: ${field} must be a string`);
        }
      }

      if (
        data.publicationYear !== undefined &&
        !Number.isInteger(data.publicationYear)
      ) {
        throw new Error(`${filePath}: publicationYear must be an integer`);
      }

      return {
        slug: path.basename(entry.name, '.mdx'),
        title: data.title,
        date,
        content,
        author: data.author,
        publisher: data.publisher,
        publicationYear: data.publicationYear,
        originalTitle: data.originalTitle,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

export const getBook = (slug: string, booksPath = BOOKS_PATH) => {
  // ponytail: a linear scan is enough for a personal log; add an index if builds become slow.
  const decodedSlug = decodeURIComponent(slug);
  return getBooks(booksPath).find((book) => book.slug === decodedSlug);
};
