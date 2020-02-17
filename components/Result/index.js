import s from './style.css';

export default function Result({ number, title, label, children }) {
  return (
    <div className={s.root}>
      {number && <div className={s.number}>{number}</div>}
      {label && <div className={s.label}>{label}</div>}
      {title && <div className={s.title}>{title}</div>}
      <div className={s.body}>{children}</div>
    </div>
  );
}
