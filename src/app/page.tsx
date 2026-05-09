import MainBlog from '@/components/ui/MainBlog';

interface Props {
  searchParams: { page?: string };
}

const Home = ({ searchParams }: Props) => {
  const page = Number(searchParams.page) || 1;
  return <MainBlog page={page} basePath="/" />;
};

export default Home;
