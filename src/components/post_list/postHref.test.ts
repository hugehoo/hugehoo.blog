import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeRouteParam, getPostHref, getPostImageHref } from './postHref.ts';

test('builds a canonical post URL from an English slug', () => {
  assert.equal(
    getPostHref('go-server-allocation-optimization'),
    '/blog/posts/go-server-allocation-optimization'
  );
});

test('keeps malformed legacy percent signs readable', () => {
  assert.equal(decodeRouteParam('할당량 37% 줄이기'), '할당량 37% 줄이기');
});

test('encodes a percent sign in a post image path', () => {
  assert.equal(
    getPostImageHref('할당량 37% 줄이기', 'result.jpg'),
    '/posts/%ED%95%A0%EB%8B%B9%EB%9F%89%2037%25%20%EC%A4%84%EC%9D%B4%EA%B8%B0/result.jpg'
  );
});
