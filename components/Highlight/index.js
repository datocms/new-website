import styles from './style.css';

export default function Highlight({ style = "neutral", children }) {
  return <strong className={styles[style]}>{children}</strong>;
}