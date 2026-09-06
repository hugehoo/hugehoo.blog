import assert from 'node:assert/strict';
import test from 'node:test';

import { getPostHref, getPostImageHref } from './postHref.ts';

test('encodes a percent sign in a post title', () => {
  assert.equal(
    getPostHref('go', '할당량 37% 줄이기'),
    '/blog/go/%ED%95%A0%EB%8B%B9%EB%9F%89%2037%25%20%EC%A4%84%EC%9D%B4%EA%B8%B0'
  );
});

test('encodes a percent sign in a post image path', () => {
  assert.equal(
    getPostImageHref('할당량 37% 줄이기', 'result.jpg'),
    '/posts/%ED%95%A0%EB%8B%B9%EB%9F%89%2037%25%20%EC%A4%84%EC%9D%B4%EA%B8%B0/result.jpg'
  );
});
