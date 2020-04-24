import Wrapper from 'components/Wrapper';
import s from './style.module.css';

export default function TitleStripWithContent({
  kicker,
  title,
  subtitle,
  children,
}) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          {kicker && <div className={s.kicker}>{kicker}</div>}
          <h2 className={s.title}>{title}</h2>
          {subtitle && <div className={s.subtitle}>{subtitle}</div>}
        </div>
        {children && <div className={s.content}>{children}</div>}
      </Wrapper>
    </div>
  );
}
