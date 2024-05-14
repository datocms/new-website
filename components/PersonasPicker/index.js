import s from './style.module.css';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import LazyImage from 'components/LazyImage';
import Highlight from 'components/Highlight';

export default function PersonasPicker() {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.intro}>
          <h2 className={s.introSub}>
            A technology investment for your whole company
          </h2>
          <h3 className={s.introTitle}>
            Empower <Highlight>every&nbsp;member</Highlight> of&nbsp;your team
          </h3>
          <p className={s.introBody}>
            The headless CMS technology provides an end-to-end solution for
            businesses who create and distribute content to websites and other
            digital experiences at scale.
          </p>
        </div>
        <div className={s.picker}>
          <Link href="/team/best-cms-for-developers">
            <a className={s.personas}>
              <div className={s.personasImage}>
                <LazyImage src={`/images/illustrations/developers-2.svg`} />
              </div>
              <h6 className={s.personasTitle}>For developers</h6>
              <div className={s.personasBody}>
                Your business needs a reliable and future-proof infrastructure
              </div>
              <div className={s.personasLink}>
                Learn more <ArrowIcon />
              </div>
            </a>
          </Link>

          <Link href="/team/cms-digital-marketing">
            <a className={s.personas}>
              <div className={s.personasImage}>
                <LazyImage src={`/images/illustrations/marketers.svg`} />
              </div>
              <h6 className={s.personasTitle}>For digital marketers</h6>
              <div className={s.personasBody}>
                Solve complex strategic goals with technology that empowers your
                team
              </div>
              <div className={s.personasLink}>
                Learn more <ArrowIcon />
              </div>
            </a>
          </Link>

          <Link href="/team/content-creators">
            <a className={s.personas}>
              <div className={s.personasImage}>
                <LazyImage src={`/images/illustrations/content-editors2.svg`} />
              </div>
              <h6 className={s.personasTitle}>For content editors</h6>
              <div className={s.personasBody}>
                Automate SEO and manage content on multiple sites without filing
                an IT ticket
              </div>
              <div className={s.personasLink}>
                Learn more <ArrowIcon />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </Wrapper>
  );
}
