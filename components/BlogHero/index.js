import Wrapper from 'components/Wrapper';
import styles from './style.module.css';
import { containsKeywords } from 'utils/containsKeyword';

export default function BlogHero({
  style = 'one',
  children,
  kicker,
  subtitle,
  seoAnalysis,
}) {
  let Title;
  let Subtitle;
  let Kicker;

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);

    Kicker = kickerContainsKeywords ? 'h1' : 'h2';
    Title = kicker && kickerContainsKeywords ? 'h2' : 'h1';
    Subtitle = 'h3';
  } else {
    Kicker = 'h2';
    Title = 'h1';
    Subtitle = 'div';
  }

  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && <Kicker className={styles.kicker}>{kicker}</Kicker>}
        <div className={styles[style]}>
          <Title className={styles.title}>{children}</Title>
        </div>
        {subtitle && (
          <Subtitle className={styles.subtitle}>{subtitle}</Subtitle>
        )}
      </div>
    </Wrapper>
  );
}
