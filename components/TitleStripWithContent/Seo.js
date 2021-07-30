import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import containsKeyword from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';

export default function SeoTitleStripWithContent({
  kicker,
  title,
  subtitle,
  keyword,
  children,
}) {
  const titleWithSeo =
    keyword && containsKeyword(title, keyword) ? (
      <h3 className={s.title}>{title}</h3>
    ) : (
      <p className={s.title}>{title}</p>
    );

  const subtitleWithSeo =
    keyword && containsKeyword(subtitle, keyword) ? (
      <h4 className={s.subtitle}>{subtitle}</h4>
    ) : (
      <div className={s.subtitle}>{subtitle}</div>
    );

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          {kicker && (
            <Heading
              as={containsKeyword(kicker, keyword) ? 'h2' : 'div'}
              className={s.kicker}
              anchor={slugify(kicker)}
            >
              {kicker}
            </Heading>
          )}
          {title && titleWithSeo}
          {subtitle && subtitleWithSeo}
        </div>
        {children && <div className={s.content}>{children}</div>}
      </Wrapper>
    </div>
  );
}
