import styles from './style.css';

export default function InterstitialTitle({ style = "good", icon: Icon, bullets }) {
  return (
    <div className={styles.root}>
      {bullets.map(bullet => (
        <div key={bullet} className={styles.bullet}>
          <div className={styles[style]}><Icon  /></div>
          <span>{bullet}</span>
        </div>
      ))}
    </div>
  );
}
