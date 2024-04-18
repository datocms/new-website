import Heading from 'components/Heading';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import { containsKeywords } from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import s from './style.module.css';

export default function TitleIllustrationStripWithContent({
  title,
  subtitle,
  image,
  children,
  kicker,
  seoAnalysis,
}) {
  let Title;
  let Subtitle;
  let Kicker;
  const alt = kicker || title;

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);

    Kicker = kickerContainsKeywords ? 'h2' : 'h3';
    Title = kickerContainsKeywords ? 'h3' : 'h2';
    Subtitle = 'h6';
  } else {
    Kicker = 'div';
    Title = 'h2';
    Subtitle = 'div';
  }

  return (
    <div className={s.root}>
      <div className={s.rootInner}>
        <div className={s.image}>
          <LazyImage src={`/images/illustrations/${image}.svg`} alt={alt} />
        </div>
        <Wrapper>
          <div className={s.body}>
            {kicker && (
              <Heading
                as={Kicker}
                className={s.kicker}
                anchor={slugify(kicker)}
              >
                {kicker}
              </Heading>
            )}
            {title && <Title className={s.title}>{title}</Title>}
            {subtitle && <Subtitle className={s.subtitle}>{subtitle}</Subtitle>}
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className={s.content}>{children}</div>
      </Wrapper>
    </div>
  );
}
