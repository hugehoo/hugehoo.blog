import MainBlog from '@/components/ui/MainBlog';

const About = async () => {
  return (
    <div className="p-3">
      <div className="mb-5 text-2xl font-semibold">
        안녕하세요{' '}
        <span className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300">
          임성후
        </span>{' '}
        입니다.
      </div>
      <div className="text-base font-normal text-gray-800">
        5년차 소프트웨어 개발자 입니다. 회사에서는 주로 백엔드 개발을 하지만
        프론트와 인프라에도 관심이 많아 이것저아 시도하길 좋아합니다. Go 언어를
        좋아해 다양한 오픈소스에 기웃거리고 있습니다. 올해는 활발히 오픈소스
        기여를 하고싶은 목표가 있습니다. 버즈빌이라는 광고 도메인 회사에서
        재직중입니다.
        <br />
        개발자 글쓰기 커뮤니티 글또에서 활동 하고 있습니다. 좋은 친구와 동료
        개발자를 만날 수 있었고, 함께 성장할 수 있는 좋은 환경을 가질 수
        있었습니다. 테크 블로그의 Read/Write 를 좋아해{' '}
        <a
          className="font-medium text-blue-500 hover:text-blue-600 transition-colors duration-300"
          href="https://blog-scrapper-ui.vercel.app/"
        >
          테크 블로그 스크래퍼
        </a>
        라는 서비스를 운영중입니다.
      </div>
    </div>
  );
};

export default About;
