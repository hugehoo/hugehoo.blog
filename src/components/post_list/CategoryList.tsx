import CategoryButton from "./CategoryButton";
import {CategoryDetail} from "@/config/types";


interface CategoryListProps {
  categoryList: CategoryDetail[];
  allPostCount: number;
  currentCategory?: string;
}

const CategoryList = async ({
                              categoryList,
                              allPostCount,
                              currentCategory = 'all'
                            }: CategoryListProps) => {

  // const router = useRouter();
  //
  // const onCategoryChange = (value: string) => {
  //   if (value === 'all') {
  //     router.push('/blog');
  //   } else {
  //     router.push(`/blog/${value}`);
  //   }
  // };

  return (
    <>
      <section>
        <ul>
          <CategoryButton
            href='/blog'
            isCurrent={currentCategory === 'all'}
            displayName='All'
            count={allPostCount}
          />
          {categoryList.map((cg: CategoryDetail) => (
            <CategoryButton key={cg.dirName}
                            href={`/blog/${cg.dirName}`}
                            isCurrent={currentCategory === cg.dirName}
                            displayName={cg.publicName}
                            count={cg.count}/>
          ))}
        </ul>
      </section>
      <section className='mb-10 sm:hidden'>

      </section>
    </>
  )

}

export default CategoryList;
