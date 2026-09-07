import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import readingTime from 'reading-time';
import styles from '../../TeamPage.module.css';
import PostMarkdown from '@/app/blog/[category]/[post-name]/postMarkdown';
import TOC from '@/app/blog/toc';
import { findPostBySlug, getPostDocuments } from '@/lib/posts';
import { getPostHref } from '@/components/post_list/postHref';
import { getAbsoluteUrl } from '@/lib/site';

interface Props {
  params: { slug: string };
}

export const generateStaticParams = () =>
  getPostDocuments()
    .filter((post) => post.data.open)
    .map((post) => ({ slug: post.data.slug }));

export const generateMetadata = ({ params }: Props): Metadata => {
  const post = findPostBySlug(params.slug);
  if (!post || !post.data.open) {
    return {};
  }

  const canonicalUrl = getAbsoluteUrl(getPostHref(post.data.slug));
  const image = post.data.thumbnail
    ? getAbsoluteUrl(post.data.thumbnail)
    : undefined;

  return {
    title: post.data.title,
    description: post.data.desc,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: post.data.title,
      description: post.data.desc,
      url: canonicalUrl,
      publishedTime: new Date(post.data.date).toISOString(),
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.data.title,
      description: post.data.desc,
      images: image ? [image] : undefined,
    },
  };
};

const Post = ({ params }: Props) => {
  const post = findPostBySlug(params.slug);

  if (!post || !post.data.open) {
    notFound();
  }

  const postDate = new Date(post.data.date);
  const readingMinutes = Math.max(
    1,
    Math.ceil(readingTime(post.content).minutes)
  );

  return (
    <div className="blog-page-wrapper">
      <div className={`${styles.textContainer} blog-layout-container`}>
        <div className={styles.wrapper}>
          <PostMarkdown
            params={{
              decodedTitle: post.data.title,
              category: post.data.category,
              content: post.content,
              date: postDate,
              readingMinutes,
            }}
          />
        </div>
      </div>
      <aside className="toc-sidebar">
        <TOC content={post.content} />
      </aside>
    </div>
  );
};

export default Post;
