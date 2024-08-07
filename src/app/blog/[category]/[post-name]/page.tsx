import { notFound } from 'next/navigation'

interface Props {
  params: {
    category: string
    'post-name': string
  }
}

export default function Post({ params }: Props) {
  const { category, 'post-name': postName } = params

  // 여기에서 실제 포스트 데이터를 가져오는 로직을 구현합니다
  // 예: 파일 시스템에서 읽기, API 호출 등
  // 포스트가 존재하지 않으면 notFound() 함수를 호출합니다

  return (
    <div>
      <h1>카테고리: {category}</h1>
      <h2>포스트 제목: {postName}</h2>
      {/* 여기에 포스트 내용을 표시하는 로직을 추가합니다 */}
    </div>
  )
}

// 선택적: 정적 생성을 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // 가능한 모든 [category]와 [post-name] 조합을 생성합니다
  // 이 부분은 실제 데이터에 따라 구현해야 합니다
  return [
    { category: 'tech', 'post-name': 'first-post' },
    { category: 'life', 'post-name': 'my-story' },
    // ... 더 많은 경로
  ]
}
