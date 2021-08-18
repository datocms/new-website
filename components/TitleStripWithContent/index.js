import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import containsKeyword from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';

export default function TitleStripWithContent({
  kicker,
  title,
  subtitle,
  keyword,
  children,
}) {
  let Title;
  let Subtitle;
  let Kicker;

  if (keyword) {
    const kickerContainsKeyword = containsKeyword(kicker, keyword);
    Kicker = kickerContainsKeyword ? 'h2' : 'h3';
    Title = kickerContainsKeyword ? 'h3' : 'h2';
    Subtitle = 'p';
  } else {
    Kicker = 'div';
    Title = 'h2';
    Subtitle = 'div';
  }

  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          {kicker && (
            <Heading as={Kicker} className={s.kicker} anchor={slugify(kicker)}>
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
