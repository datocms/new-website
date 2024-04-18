import Heading from 'components/Heading';
import Wrapper from 'components/Wrapper';
import { containsKeywords } from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import styles from './style.module.css';

export default function InterstitialTitle({
  style = 'one',
  children,
  kicker,
  subtitle,
  bigSubtitle,
  seoAnalysis,
  mainTitleOfPage,
  below,
}) {
  let Title;
  let Subtitle;
  let Kicker;

  const ifMainTitle = (a, b) => (mainTitleOfPage ? a : b);

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);
    Kicker = kickerContainsKeywords
      ? ifMainTitle('h1', 'h2')
      : ifMainTitle('h2', 'h3');
    Title =
      kicker && kickerContainsKeywords
        ? ifMainTitle('h2', 'h3')
        : ifMainTitle('h1', 'h2');
    Subtitle =
      subtitle && containsKeywords(subtitle, seoAnalysis) ? 'h4' : 'h6';
  } else {
    Kicker = 'h2';
    Title = ifMainTitle('h1', 'h3');
    Subtitle = 'div';
  }

  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && (
          <Heading
            as={Kicker}
            className={styles.kicker}
            anchor={ifMainTitle(null, slugify(kicker))}
          >
            {kicker}
          </Heading>
        )}
        <div className={styles[style]}>
          <Title className={styles.title}>{children}</Title>
        </div>
        {subtitle && (
          <Subtitle
            className={bigSubtitle ? styles.bigSubtitle : styles.subtitle}
          >
            {subtitle}
          </Subtitle>
        )}
        {below}
      </div>
    </Wrapper>
  );
}
