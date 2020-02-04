import Wrapper from 'components/Wrapper';
import s from './style.css';

export default function TitleIllustrationStripWithContent({
  title,
  subtitle,
  image: Image,
  children,
}) {
  return (
    <div className={s.root}>
      <div className={s.rootInner}>
        <Wrapper>
          <div className={s.body}>
            <div className={s.title}>{title}</div>
            <div className={s.subtitle}>{subtitle}</div>
          </div>
        </Wrapper>

        <div className={s.image}>
          <Image />
        </div>
      </div>
      <Wrapper>
        <div className={s.content}>{children}</div>
      </Wrapper>
    </div>
  );
}
