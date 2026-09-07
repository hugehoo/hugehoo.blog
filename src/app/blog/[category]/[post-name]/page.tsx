import { notFound, permanentRedirect } from 'next/navigation';
import { decodeRouteParam, getPostHref } from '@/components/post_list/postHref';
import { findPostByLegacyPath } from '@/lib/posts';

interface Props {
  params: {
    category: string;
    'post-name': string;
  };
}

const LegacyPost = ({ params }: Props) => {
  const category = decodeRouteParam(params.category);
  const title = decodeRouteParam(params['post-name']);
  const post = findPostByLegacyPath(category, title);

  if (!post) {
    notFound();
  }

  permanentRedirect(getPostHref(post.data.slug));
};

export default LegacyPost;
