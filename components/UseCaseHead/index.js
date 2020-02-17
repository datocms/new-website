import Wrapper from 'components/Wrapper';
import s from './style.css';
import Dato from 'public/images/logos/datocms.svg';
import cn from 'classnames';

export default function UseCaseHead({ title, logo: logoUrl, image, children }) {
  return (
    <div className={s.root}>
      <div className={cn(s.box, s.boxImage)}>
        <div className={s.image} style={{ backgroundImage: `url(${image})` }} />
      </div>
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
              <div className={s.cta}>Read the success case</div>
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
              <div className={s.cta}>Read the success case</div>
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}
