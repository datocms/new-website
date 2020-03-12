import Wrapper from 'components/Wrapper';
import LazyImage from 'components/LazyImage';
import s from './style.module.css';

export default function TitleIllustrationStripWithContent({
  title,
  subtitle,
  image,
  children,
}) {
  return (
    <div className={s.root}>
      <div className={s.rootInner}>
        <div className={s.image}>
          <LazyImage src={`/images/illustrations/${image}.svg`} />
        </div>
        <Wrapper>
          <div className={s.body}>
            <div className={s.title}>{title}</div>
            <div className={s.subtitle}>{subtitle}</div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className={s.content}>{children}</div>
      </Wrapper>
    </div>
  );
}
