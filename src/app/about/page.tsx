const anchorProperty =
  'font-medium text-blue-500 hover:text-blue-600 transition-colors duration-300';

const subTitleProperty = 'text-xl mb-3 font-semibold';
const About = async () => {
  return (
    <>
      <div className="p-2 min-h-[75vh] text-base font-normal text-gray-800 leading-7">
        <div className="mb-5 text-2xl font-semibold">
          안녕하세요{' '}
          <span className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300">
            임성후
          </span>{' '}
          입니다.
        </div>
        <div>
          5년차 소프트웨어 개발자로 Go 기반의 서버 개발을 하고 있습니다. <br />{' '}
          올해는 오픈소스에 활발히 기여하고 싶은 목표가 있습니다.
          <br />
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
          <div className={subTitleProperty}>글쓰기와 블로그</div>
          <div>
            5년간{' '}
            <a
              className={anchorProperty}
              href="https://junior-datalist.tistory.com/"
            >
              티스토리 블로그
            </a>
            를 운영했지만 마음 한켠엔 늘 직접 블로그를 개발하고 싶은 로망이
            있었는데요, 현재 블로그는 그 로망을 한 걸음씩 실현해 가는 과정으로
            봐주시면 감사하겠습니다.
            <div>
              개발자 글쓰기 커뮤니티 <b>글또</b>에서 5년째 활동하고 있습니다.{' '}
              {/* <br /> */}
              어른이지만 더 어른이 돼서도 글 쓰는 개발자이고 싶습니다.
              <br />
              <br />
              <div className={subTitleProperty}>사이드 프로젝트</div>
              <ul className="list-disc list-inside">
                <li>
                  테크 블로그의 Read/Write 를 좋아해{' '}
                  <a
                    className={anchorProperty}
                    href="https://blog-scrapper-ui.vercel.app/"
                  >
                    테크 블로그 스크래퍼
                  </a>
                  라는 서비스를 운영중입니다. (2024.09 ~ )
                </li>
                <li>
                  <a
                    className={anchorProperty}
                    href="https://github.com/hugehoo/tidify-be"
                  >
                    IOS APP
                  </a>{' '}
                  의 서버 개발을 담당하여 1년간 운영한 경험이 있습니다. (2023.05
                  ~ 2024.04)
                </li>
                <li>
                  2022 Junction Asia 해커톤{' '}
                  <a href="https://www.newsis.com/view/?id=NISX20220822_0001985841">
                    Zep
                  </a>{' '}
                  트랙에서 1위를 수상한 경험이 있습니다.{' '}
                  <a href="https://github.com/ZEP-SIGHT/junction-back">
                    🔗Github (2022.08)
                  </a>
                </li>
              </ul>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
