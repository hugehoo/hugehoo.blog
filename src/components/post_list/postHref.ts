export const getPostHref = (category: string, title: string) =>
  `/blog/${category}/${encodeURIComponent(title)}`;

export const getPostImageHref = (title: string, src: string) =>
  `/posts/${encodeURIComponent(title)}/${src}`;
