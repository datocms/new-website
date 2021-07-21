import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import containsKeyword from 'utils/containsKeyword';

export default function SeoTitleStripWithContent({
  kicker,
  title,
  subtitle,
  keyword,
  children,
}) {
  const kickerWithSeo = containsKeyword(kicker, keyword) ? (
    <h2 className={s.kicker}>{kicker}</h2>
  ) : (
    <div className={s.kicker}>{kicker}</div>
  );

  const titleWithSeo = containsKeyword(title, keyword) ? (
    <h3 className={s.title}>{title}</h3>
  ) : (
    <p className={s.title}>{title}</p>
  );

  const subtitleWithSeo = containsKeyword(subtitle, keyword) ? (
    <h4 className={s.subtitle}>{subtitle}</h4>
  ) : (
    <div className={s.subtitle}>{subtitle}</div>
  );

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          {kicker && kickerWithSeo}
          {title && titleWithSeo}
          {subtitle && subtitleWithSeo}
        </div>
        {children && <div className={s.content}>{children}</div>}
      </Wrapper>
    </div>
  );
}
