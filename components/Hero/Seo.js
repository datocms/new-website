import Wrapper from 'components/Wrapper';
import styles from './style.module.css';
import containsKeyword from 'utils/containsKeyword';

export default function SeoHero({
  image,
  kicker,
  title,
  subtitle,
  keyword,
  children,
}) {
  const Kicker = containsKeyword(kicker, keyword) ? 'h1' : 'p';
  const Title = containsKeyword(children, keyword) ? 'h2' : 'p';
  const Subtitle = containsKeyword(subtitle, keyword) ? 'h3' : 'p';

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
