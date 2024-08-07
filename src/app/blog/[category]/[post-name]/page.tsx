import styles from '../../TeamPage.module.css'

interface Props {
  params: {
    category: string
    thumbnail: string
    'post-name': string
  }
}

const Post = ({params}: Props) => {
  const {category, 'post-name': postName, thumbnail} = params
  return (
    <div className={styles.textContainer}>
      <h1>Category: {category}</h1>
      <h2>Title: {postName}</h2>
      <p>
      </p>
      {/* 여기에 포스트 내용을 표시하는 로직을 추가합니다 */}
    </div>
  )
}

export default Post;
