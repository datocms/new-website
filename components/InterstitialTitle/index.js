import Wrapper from 'components/Wrapper';
import styles from './style.module.css';

export default function InterstitialTitle({
  style = 'one',
  children,
  kicker,
  subtitle,
}) {
  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && <h2 className={styles.kicker}>{kicker}</h2>}
        <div className={styles[style]}>
          <h3 className={styles.title}>{children}</h3>
        </div>
        {subtitle && <h4 className={styles.subtitle}>{subtitle}</h4>}
      </div>
    </Wrapper>
  );
}
