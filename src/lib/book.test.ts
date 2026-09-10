import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { getBook, getBookByLegacySlug, getBooks } from './book.ts';

test('loads book records newest first and rejects incomplete frontmatter', () => {
  const booksPath = mkdtempSync(path.join(tmpdir(), 'hugehoo-books-'));

  try {
    writeFileSync(
      path.join(booksPath, 'older.mdx'),
      '---\ntitle: "오래된 책"\nslug: older-book\ndate: 2025-01-01\n---\n\n첫 기록'
    );
    writeFileSync(
      path.join(booksPath, 'newer.mdx'),
      `---
title: "새로운 책"
slug: newer-book
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
        { slug: 'newer-book', title: '새로운 책' },
        { slug: 'older-book', title: '오래된 책' },
      ]
    );
    assert.equal(getBook('older-book', booksPath)?.content.trim(), '첫 기록');
    assert.equal(getBookByLegacySlug('older', booksPath)?.slug, 'older-book');
    assert.deepEqual(
      {
        author: getBook('newer-book', booksPath)?.author,
        publisher: getBook('newer-book', booksPath)?.publisher,
        publicationYear: getBook('newer-book', booksPath)?.publicationYear,
        originalTitle: getBook('newer-book', booksPath)?.originalTitle,
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
      '---\ntitle: "한글 책"\nslug: korean-book\ndate: 2024-01-01\n---\n'
    );
    assert.equal(
      getBookByLegacySlug(encodeURIComponent('한글-책'), booksPath)?.title,
      '한글 책'
    );

    writeFileSync(
      path.join(booksPath, 'invalid.mdx'),
      '---\ntitle: "날짜 없는 책"\nslug: invalid\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /title and date/);
    unlinkSync(path.join(booksPath, 'invalid.mdx'));

    writeFileSync(
      path.join(booksPath, 'invalid-metadata.mdx'),
      '---\ntitle: "잘못된 정보"\nslug: invalid-metadata\ndate: 2026-01-01\nauthor:\n  - "저자"\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /author must be a string/);
    unlinkSync(path.join(booksPath, 'invalid-metadata.mdx'));

    writeFileSync(
      path.join(booksPath, 'invalid-year.mdx'),
      '---\ntitle: "잘못된 연도"\nslug: invalid-year\ndate: 2026-01-01\npublicationYear: "2022"\n---\n'
    );
    assert.throws(
      () => getBooks(booksPath),
      /publicationYear must be an integer/
    );
    unlinkSync(path.join(booksPath, 'invalid-year.mdx'));

    writeFileSync(
      path.join(booksPath, 'invalid-slug.mdx'),
      '---\ntitle: "잘못된 슬러그"\nslug: 한글-슬러그\ndate: 2026-01-01\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /invalid slug/);
    unlinkSync(path.join(booksPath, 'invalid-slug.mdx'));

    writeFileSync(
      path.join(booksPath, 'duplicate.mdx'),
      '---\ntitle: "중복 슬러그"\nslug: older-book\ndate: 2026-01-01\n---\n'
    );
    assert.throws(() => getBooks(booksPath), /Duplicate book slug/);
  } finally {
    rmSync(booksPath, { recursive: true, force: true });
  }
});
