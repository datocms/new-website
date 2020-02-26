import s from './style.css';
import Link from 'next/link';
import Wrapper from 'components/Wrapper';
import { highlightHtml } from 'components/Highlight';
import LazyImage from 'components/LazyImage';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';

export default function UseCaseExcerpts({ cases }) {
  const firstCase = cases[0];

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.inner}>
          <div className={s.title}>Read their stories</div>
          <Link href="/customers/[slug]" as={`/customers/${firstCase.slug}`}>
            <a className={s.mainStory}>
              <div className={s.mainStoryLogo}>
                <LazyImage src={firstCase.logo.url} />
              </div>
              <div className={s.mainStoryTitle}>
                {highlightHtml(firstCase.title)}
              </div>
              <div className={s.goto}>Read the story <ArrowIcon /></div>
            </a>
          </Link>
          {cases.slice(1).map(useCase => (
            <Link
              key={useCase.slug}
              href="/customers/[slug]"
              as={`/customers/${useCase.slug}`}
            >
              <a key={useCase.slug} className={s.otherUseCase}>
                <div className={s.otherStoryLogo}>
                  <LazyImage src={useCase.logo.url} />
                </div>
                <div className={s.otherUseCaseTitle}>
                  {highlightHtml(useCase.title)}
                </div>
                <div className={s.goto}>Read the story <ArrowIcon /></div>
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
