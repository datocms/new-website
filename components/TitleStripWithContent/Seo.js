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
  const Title = containsKeyword(children, keyword) ? 'h3' : 'p';
  const Subtitle = containsKeyword(subtitle, keyword) ? 'h4' : 'div';

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
          {title && <Title className={s.title}>{title}</Title>}
          {subtitle && <Subtitle className={s.subtitle}>{subtitle}</Subtitle>}
        </div>
        {children && <div className={s.content}>{children}</div>}
      </Wrapper>
    </div>
  );
}
