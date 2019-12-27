import styles from './style.css';

export default function Highlight({ children }) {
  return <strong className={styles.root}>{children}</strong>;
}