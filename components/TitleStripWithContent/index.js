import Wrapper from 'components/Wrapper';
import s from './style.css';

export default function TitleStripWithContent({ title, subtitle, children }) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.title}>
            {title}
          </div>
          {subtitle && <div className={s.subtitle}>{subtitle}</div>}
        </div>
        <div className={s.content}>{children}</div>
      </Wrapper>
    </div>
  );
}
