import {useRouter} from "next/router";
import Link from "next/link";
import {Button} from "@/components/ui/button";



interface Props {
  isCurrent: boolean;
  displayName: string;
  href: string;
  count: number;

}
export const CategoryButton = async ({isCurrent, displayName, href, count}: Props) => {

  return (
    <>
      <Button asChild>
        <Link href={href}>
          {displayName} ({count})
        </Link>
      </Button>

    </>
  )

}

export default CategoryButton;
