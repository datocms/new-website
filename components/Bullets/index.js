import styles from './style.module.css';

export default function Bullets({
  style = 'good',
  icon: Icon,
  bullets,
  largeBullet = false,
}) {
  return (
    <ul className={styles.root}>
      {bullets.map((bullet) => (
        <li
          key={bullet}
          className={!largeBullet ? styles.bullet : styles.largeBullet}
        >
          <div className={styles[style]}>
            <Icon />
          </div>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}
