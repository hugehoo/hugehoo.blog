import styles from "@/app/blog/TeamPage.module.css";
import FlipCard from "@/components/ui/FlipCard";
import CardSection from "@/components/ui/CardSection";

export interface CardInterface {
  name: string;
  role: string;
}

const MainBlog = () => {
  const posts: CardInterface[] = [
    {name: 'Post1', role: 'CEO BALENCIAGA'},
    {name: 'Post2', role: 'CEO REBORN & YELLOW OCTOPUS'},
    {name: 'Post3', role: 'FOUNDER THE MILLS'}
  ];
  return (
    <section className={styles.teamSection}>
      <div className={styles.underlineTitle}>
        <p>Posts</p>
      </div>
      <CardSection posts = {posts}/>
    </section>
  )
}

export default MainBlog;
