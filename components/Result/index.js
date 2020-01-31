import s from './style.css';

export default function Result({ number, label, children }) {
  return (
    <div className={s.root}>
      <div className={s.number}>{number}</div>
      <div className={s.label}>{label}</div>
      <div className={s.body}>{children}</div>
    </div>
  );
}
