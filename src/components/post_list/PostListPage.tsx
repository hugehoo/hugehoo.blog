import {getAllPostCount, getCategoryDetailList, getPostList} from "@/components/parsePostAbstract";
import PostCard from "@/components/post_list/PostCard";
import CategoryList from "@/components/post_list/CategoryList";

interface PostListProps {
  category?: string;
}

const PostListPage = async ({category}: PostListProps) => {
  const postList = await getPostList(category);
  const categoryList = await getCategoryDetailList();
  const allPostCount = await getAllPostCount();

  return (
    <section>
      <CategoryList
        categoryList={categoryList}
        allPostCount={allPostCount}
        currentCategory={category}
      />
      <section>
        <ul>
          {postList.map((post) => (
            <PostCard key={post.url + post.date} post={post}/>
          ))}
        </ul>
      </section>
    </section>
  );
}


export default PostListPage;
