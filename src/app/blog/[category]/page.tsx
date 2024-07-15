import PostListPage from "@/components/post_list/PostListPage";



type Props = {
  params: { category: string };
}


export function generateStaticParams() {
  // let categoryList = getCategoryList();
}

const CategoryPage = async ({params}: Props) => {
  return <PostListPage category={params.category}/>
};


export default CategoryPage;
