import Wrapper from 'components/Wrapper';
import { containsKeywords } from 'utils/containsKeyword';
import styles from './style.module.css';

export default function Hero({
  image,
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

    Kicker = kickerContainsKeywords ? 'h1' : 'h2';
    Title = kickerContainsKeywords ? 'h2' : 'h1';
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
        {image && <div className={styles.kicker}>{image}</div>}
        {title && <Title className={styles.title}>{title}</Title>}
        {subtitle && (
          <Subtitle className={styles.subtitle}>{subtitle}</Subtitle>
        )}
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </Wrapper>
  );
}
