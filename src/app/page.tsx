import Image from "next/image";
import {getPostList} from "@/components/parsePostAbstract";
import PostCard from "@/components/post_list/PostCard";
import {redirect} from "next/navigation";




export default function Home() {
  redirect('/blog');
}
