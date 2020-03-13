import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import Dato from 'public/images/logos/datocms.svg';
import cn from 'classnames';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import BackgroundImage from 'components/BackgroundImage';

export default function UseCaseHead({ title, logo: logoUrl, image }) {
  return (
    <div className={s.root}>
      <div className={cn(s.box, s.boxText)}>
        <div className={s.boxInner}>
          <Wrapper>
            <div className={s.inner}>
              <div className={s.kicker}>
                <img src={logoUrl} />
                <span className={s.plus}>+</span>
                <Dato />
              </div>
              <div className={s.title}>{title}</div>
              <a className={s.cta} href="#usecase">
                Read the success case <ArrowIcon />
              </a>
            </div>
          </Wrapper>
        </div>
      </div>
      <div className={cn(s.box, s.boxCut)}>
        <div className={s.boxInner}>
          <Wrapper>
            <div className={s.inner}>
              <div className={s.kicker}>
                <img src={logoUrl} />
                <span className={s.plus}>+</span>
                <Dato />
              </div>
              <div className={s.title}>{title}</div>
              <a className={s.cta} href="#usecase">
                Read the success case <ArrowIcon />
              </a>
            </div>
          </Wrapper>
        </div>
      </div>
      <div className={cn(s.box, s.boxImage)}>
        <BackgroundImage
          className={s.image}
          src={`${image}&fit=min&fm=png8&q=90&crop=center`}
        />
      </div>
    </div>
  );
}
