import Wrapper from 'components/Wrapper';
import styles from './style.module.css';
import containsKeyword from 'utils/containsKeyword';

export default function Hero({
  image,
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

    Kicker = kickerContainsKeyword ? 'h1' : 'h2';
    Title = kickerContainsKeyword ? 'h2' : 'h1';
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
