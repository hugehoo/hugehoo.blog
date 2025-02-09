const About = async () => {
  return (
    <>
      <div className="p-2 min-h-[75vh] text-base font-normal text-gray-800">
        {/* <div>{t('title')}</div> */}
        <div className="mb-5 text-2xl font-semibold">
          안녕하세요{' '}
          <span className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300">
            임성후
          </span>{' '}
          입니다.
        </div>
        <div>
          5년차 소프트웨어 개발자로 Golang 기반의 서버 개발을 하고 있습니다.{' '}
          올해는 활발히 오픈소스 기여를 하고싶은 목표가 있습니다.
        </div>
        <div>
          현재{' '}
          <a
            href="https://www.buzzvil.com/"
            className="font-medium text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            버즈빌
          </a>
          에서 Engagement 제품을 개발하고 있습니다.
        </div>
        <br />
        <div>
          <div className="text-xl mb-3 font-semibold">글쓰기와 블로그</div>
          <div>
            개발자 글쓰기 커뮤니티 <b>글또</b>에서 활동하고 있습니다. 어른이지만
            더 어른이 되어서도 꾸준히 글을 쓰는 개발자이고 싶습니다. <br />
            4년간 티스토리 블로그를 운영했지만 마음 한켠엔 늘 직접 블로그를
            개발하고 싶은 꿈이 있었습니다. 현재 블로그는 그 꿈을 한 걸음씩
            실현해 가는 과정이라 봐주시면 감사하겠습니다.
            <div>
              + 테크 블로그의 Read/Write 를 좋아해{' '}
              <a
                className="font-medium text-blue-500 hover:text-blue-600 transition-colors duration-300"
                href="https://blog-scrapper-ui.vercel.app/"
              >
                테크 블로그 스크래퍼
              </a>
              라는 서비스를 운영중입니다.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
