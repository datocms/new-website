import Wrapper from 'components/Wrapper';
import styles from './style.css';

export default function InterstitialTitle({ title, image, children }) {
  return (
    <Wrapper>
      <div className={styles.root}>
        <div className={styles.image}>{image}</div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.body}>
            {children}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
