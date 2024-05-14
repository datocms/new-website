import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { containsKeywords } from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import Heading from 'components/Heading';

export default function TitleStripWithContent({
  kicker,
  title,
  subtitle,
  seoAnalysis,
  children,
}) {
  let Title;
  let Subtitle;
  let Kicker;

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);

    Kicker = kickerContainsKeywords ? 'h2' : 'h3';
    Title = kickerContainsKeywords ? 'h3' : 'h2';
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
