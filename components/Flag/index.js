import Wrapper from 'components/Wrapper';
import styles from './style.css';

export default function Flag({ style = "neutral", title, image: Image, children }) {
  return (
    <Wrapper>
      <div className={styles.root}>
        <div className={styles[style]}>
          <Image preserveAspectRatio="xMinyMin meet" />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = "good", children }) {
  return <strong className={styles[`${style}Highlight`]}>{children}</strong>;
}