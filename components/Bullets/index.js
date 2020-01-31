import styles from './style.css';

export default function InterstitialTitle({ style = "good", icon: Icon, bullets }) {
  return (
    <div className={styles.root}>
      {bullets.map(bullet => (
        <div key={bullet} className={styles.bullet}>
          <Icon className={styles[style]} /> {bullet}
        </div>
      ))}
    </div>
  );
}
