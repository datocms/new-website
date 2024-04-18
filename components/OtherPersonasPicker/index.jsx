import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import s from './style.module.css';

export default function PersonasPicker({ title, currentPersonas }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.intro}>
          <div className={s.introTitle}>{title}</div>
          <div className={s.introBody}>
            DatoCMS is a concrete benefit for the whole company. See how DatoCMS
            can help the entire digital pipeline.
          </div>
        </div>
        <div className={s.picker}>
          {currentPersonas !== 'developers' && (
            <Link href="/team/best-cms-for-developers">
              <a className={s.personas}>
                <div className={s.personasImage}>
                  <LazyImage src={'/images/illustrations/developers-2.svg'} />
                </div>
                <div className={s.personasTitle}>For developers</div>
                <div className={s.personasBody}>
                  Your business needs a reliable and future-proof infrastructure
                </div>
                <div className={s.personasLink}>
                  Learn more <ArrowIcon />
                </div>
              </a>
            </Link>
          )}

          {currentPersonas !== 'digital-marketers' && (
            <Link href="/team/cms-digital-marketing">
              <a className={s.personas}>
                <div className={s.personasImage}>
                  <LazyImage src={'/images/illustrations/marketers.svg'} />
                </div>
                <div className={s.personasTitle}>For digital marketers</div>
                <div className={s.personasBody}>
                  Solve complex strategic goals with technology that empowers
                  your team
                </div>
                <div className={s.personasLink}>
                  Learn more <ArrowIcon />
                </div>
              </a>
            </Link>
          )}

          {currentPersonas !== 'content-creators' && (
            <Link href="/team/content-creators">
              <a className={s.personas}>
                <div className={s.personasImage}>
                  <LazyImage
                    src={'/images/illustrations/content-editors2.svg'}
                  />
                </div>
                <div className={s.personasTitle}>For content editors</div>
                <div className={s.personasBody}>
                  Automate SEO and manage content on multiple sites without
                  filing an IT ticket
                </div>
                <div className={s.personasLink}>
                  Learn more <ArrowIcon />
                </div>
              </a>
            </Link>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
