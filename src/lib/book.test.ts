import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { getBook, getBooks } from './book.ts';

test('loads book records newest first and rejects incomplete frontmatter', () => {
  const booksPath = mkdtempSync(path.join(tmpdir(), 'hugehoo-books-'));

  try {
    writeFileSync(
      path.join(booksPath, 'older.mdx'),
      '---\ntitle: "오래된 책"\ndate: 2025-01-01\n---\n\n첫 기록'
    );
    writeFileSync(
      path.join(booksPath, 'newer.mdx'),
      `---
title: "새로운 책"
date: 2026-08-10
author: "저자"
publisher: "출판사"
publicationYear: 2022
originalTitle: "Original Title (2021)"
---

두 번째 기록`
    );

    assert.deepEqual(
      getBooks(booksPath).map(({ slug, title }) => ({ slug, title })),
      [
        { slug: 'newer', title: '새로운 책' },
        { slug: 'older', title: '오래된 책' },
      ]
    );
    assert.equal(getBook('older', booksPath)?.content.trim(), '첫 기록');
    assert.deepEqual(
      {
        author: getBook('newer', booksPath)?.author,
        publisher: getBook('newer', booksPath)?.publisher,
        publicationYear: getBook('newer', booksPath)?.publicationYear,
        originalTitle: getBook('newer', booksPath)?.originalTitle,
      },
      {
        author: '저자',
        publisher: '출판사',
        publicationYear: 2022,
        originalTitle: 'Original Title (2021)',
      }
    );
    assert.equal(getBook('missing', booksPath), undefined);

    writeFileSync(
      path.join(booksPath, '한글-책.mdx'),
      '---\ntitle: "한글 책"\ndate: 2024-01-01\n---\n'
    );
    assert.equal(
      getBook(encodeURIComponent('한글-책'), booksPath)?.title,
      '한글 책'
    );

    writeFileSync(
      path.join(booksPath, 'invalid.mdx'),
      '---\ntitle: "날짜 없는 책"\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /title and date/);
    unlinkSync(path.join(booksPath, 'invalid.mdx'));

    writeFileSync(
      path.join(booksPath, 'invalid-metadata.mdx'),
      '---\ntitle: "잘못된 정보"\ndate: 2026-01-01\nauthor:\n  - "저자"\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /author must be a string/);
    unlinkSync(path.join(booksPath, 'invalid-metadata.mdx'));

    writeFileSync(
      path.join(booksPath, 'invalid-year.mdx'),
      '---\ntitle: "잘못된 연도"\ndate: 2026-01-01\npublicationYear: "2022"\n---\n'
    );
    assert.throws(
      () => getBooks(booksPath),
      /publicationYear must be an integer/
    );
  } finally {
    rmSync(booksPath, { recursive: true, force: true });
  }
});
