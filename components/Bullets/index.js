import styles from './style.module.css';

export default function Bullets({ style = 'good', icon: Icon, bullets }) {
  return (
    <ul className={styles.root}>
      {bullets.map((bullet) => (
        <li key={bullet} className={styles.bullet}>
          <div className={styles[style]}>
            <Icon />
          </div>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
