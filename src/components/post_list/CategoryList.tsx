'use client';
import CategoryButton from "./CategoryButton";
import {CategoryDetail} from "@/config/types";
import {useRouter} from "next/navigation";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


interface CategoryListProps {
  categoryList: CategoryDetail[];
  allPostCount: number;
  currentCategory?: string;
}

export const CategoryList = async ({
                        categoryList,
                        allPostCount,
                        currentCategory = 'all'
                      }: CategoryListProps) => {

  const router = useRouter();

  const onCategoryChange = (value: string) => {
    if (value === 'all') {
      router.push('/blog');
    } else {
      router.push(`/blog/${value}`);
    }
  };

  console.log(categoryList)

  return (
    <>
      <section className='mb-10 hidden sm:block'>
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
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Theme'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All ({allPostCount})</SelectItem>
            {categoryList.map((cg) => (
              <SelectItem key={cg.dirName} value={cg.dirName}>
                {cg.publicName} ({cg.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </>
  );

}

export default CategoryList;
