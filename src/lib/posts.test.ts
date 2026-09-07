import assert from 'node:assert/strict';
import test from 'node:test';

import { getPostDocuments, isValidPostSlug } from './posts.ts';

test('all posts have unique English slugs', () => {
  const posts = getPostDocuments();
  const slugs = posts.map((post) => post.data.slug);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.every(isValidPostSlug));
});
