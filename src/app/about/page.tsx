const anchorProperty =
  'font-medium text-blue-500 hover:text-blue-600 transition-colors duration-300';

const subTitleProperty = 'text-xl mb-3 font-semibold';
const About = async () => {
  return (
    <>
      <div className="p-2 min-h-[75vh] text-base font-normal text-gray-800 dark:text-gray-200 leading-7">
        <div className="mb-5 text-2xl font-semibold">
          안녕하세요{' '}
          <span className="text-yellow-500 hover:text-yellow-600 transition-colors duration-300">
            임성후
          </span>{' '}
          입니다.
        </div>
        <div>
          7년차 소프트웨어 개발자로{' '}
          <a
            href="https://www.buzzvil.com/"
            className="font-medium text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            버즈빌
          </a>
          에서 서버 개발을 주로 맡고, 최근에는 프론트엔드/인프라 가리지
          않고 기여하고 있습니다. <br/>
          AI 시대에 인간만이 쓸 수 있는 글을 쓰려 노력합니다.
          <br />
        </div>
        <br />
        <div>
            <div className={subTitleProperty}>사이드 프로젝트</div>
            <ul className="list-disc list-inside">
              <li>
                <a
                  className={anchorProperty}
                  href="https://sponge-nitrogen-136.notion.site/Opensource-259ace4e50c68007812ec172c74ace00"
                >
                  Open Source Contribution
                </a>
              </li>
              <li>
                <a
                  className={anchorProperty}
                  href="https://www.newsis.com/view/?id=NISX20220822_0001985841"
                >
                  2022 Junction Asia 해커톤 Zep 트랙 1위
                </a>
                <li>
                  <a
                    className={anchorProperty}
                    href="https://junior-datalist.tistory.com/"
                  >
                    티스토리 블로그
                  </a>
                </li>
              </li>
            </ul>
            <br />
        </div>
      </div>
    </>
  );
};

export default About;
