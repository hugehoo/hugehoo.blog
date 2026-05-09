import MainBlog from '@/components/ui/MainBlog';

interface Props {
  params: { category: string };
  searchParams: { page?: string };
}

const CategoryPage = ({ params, searchParams }: Props) => {
  const category = decodeURIComponent(params.category);
  const page = Number(searchParams.page) || 1;
  return (
    <MainBlog
      category={category}
      page={page}
      basePath={`/blog/${params.category}`}
    />
  );
};

export default CategoryPage;
