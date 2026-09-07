export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hugehoo-blog.vercel.app'
).replace(/\/$/, '');

export const getAbsoluteUrl = (pathname: string) => `${SITE_URL}${pathname}`;
