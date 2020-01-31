import Wrapper from 'components/Wrapper';
import { Textfit } from 'react-textfit';
import styles from "./style.css";

export default function InterstitialTitle({ children, kicker, subtitle }) {
  return (
    <Wrapper>
      <div className={styles.root}>
        {kicker && <div className={styles.kicker}>{kicker}</div>}
        <Textfit className={styles.title} mode="multi" min={20} max={70}>
          {children}
        </Textfit>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </Wrapper>
  );
}
