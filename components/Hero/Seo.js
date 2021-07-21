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
  const titleWithSeo = containsKeyword(title, keyword) ? (
    <h2 className={styles.title}>{title}</h2>
  ) : (
    <p className={styles.title}>{title}</p>
  );

  const subtitleWithSeo = containsKeyword(subtitle, keyword) ? (
    <h3 className={styles.subtitle}>{subtitle}</h3>
  ) : (
    <p className={styles.subtitle}>{subtitle}</p>
  );

  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && <h1 className={styles.kicker}>{kicker}</h1>}
        {image && <div className={styles.kicker}>{image}</div>}
        {title && titleWithSeo}
        {subtitle && subtitleWithSeo}
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </Wrapper>
  );
}
