import styles from '../TeamPage.module.css'
import {Header} from "@/layouts/Header";
import MainIntro from "@/components/ui/MainIntro";
import MainBlog from "@/components/ui/MainBlog";
import {Bottom} from "@/layouts/Bottom";

const Blog = async () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Header/>
        <MainIntro/>
        <MainBlog/>
        <Bottom/>
      </main>
    </div>
  )
}

export default Blog;
