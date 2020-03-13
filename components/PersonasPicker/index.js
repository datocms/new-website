import s from './style.module.css';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import LazyImage from 'components/LazyImage';

export default function PersonasPicker() {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.intro}>
          <div className={s.introSub}>
            A technology investment for your whole company
          </div>
          <div className={s.introTitle}>Empower every member of your team</div>
          <div className={s.introBody}>
            An end-to-end solution for businesses who create and distribute
            content to websites and other digital experiences at scale.
          </div>
        </div>
        <div className={s.picker}>
          <Link href="/team/developers">
            <a className={s.personas}>
              <div className={s.personasImage}>
                <LazyImage src={`/images/illustrations/developers-2.svg`} />
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

          <Link href="/team/digital-marketers">
            <a className={s.personas}>
              <div className={s.personasImage}>
                <LazyImage src={`/images/illustrations/marketers.svg`} />
              </div>
              <div className={s.personasTitle}>For digital marketers</div>
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
              <div className={s.personasTitle}>For content editors</div>
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
