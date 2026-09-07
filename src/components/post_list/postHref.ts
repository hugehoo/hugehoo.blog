export const getPostHref = (slug: string) => `/blog/posts/${slug}`;

export const decodeRouteParam = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const getPostImageHref = (title: string, src: string) =>
  `/posts/${encodeURIComponent(title)}/${src}`;
