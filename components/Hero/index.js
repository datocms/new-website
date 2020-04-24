import Wrapper from 'components/Wrapper';
import styles from './style.module.css';

export default function Hero({ kicker, title, subtitle, children }) {
  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && <div className={styles.kicker}>{kicker}</div>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        {children && <div className={styles.children}>{children}</div>}
      </div>
    </Wrapper>
  );
}
