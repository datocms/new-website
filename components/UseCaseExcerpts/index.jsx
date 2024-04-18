import { highlightStructuredText } from 'components/Highlight';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import s from './style.module.css';

export default function UseCaseExcerpts({ cases }) {
  const firstCase = cases[0];

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.inner}>
          <h2 className={s.title}>Read their stories</h2>
          <Link href={`/customers/${firstCase.slug}`}>
            <a className={s.mainStory}>
              <div className={s.mainStoryLogo}>
                <LazyImage src={firstCase.logo.url} />
              </div>
              <h5 className={s.mainStoryTitle}>
                {highlightStructuredText(firstCase.title)}
              </h5>
              <div className={s.goto}>
                Read the story <ArrowIcon />
              </div>
            </a>
          </Link>
          {cases.slice(1).map((useCase) => (
            <Link key={useCase.slug} href={`/customers/${useCase.slug}`}>
              <a key={useCase.slug} className={s.otherUseCase}>
                <div className={s.otherStoryLogo}>
                  <LazyImage src={useCase.logo.url} />
                </div>
                <h5 className={s.otherUseCaseTitle}>
                  {highlightStructuredText(useCase.title)}
                </h5>
                <div className={s.goto}>
                  Read the story <ArrowIcon />
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
