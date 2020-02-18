import MaybeLink from 'components/MaybeLink';
import s from './style.css';

export default function Result({ number, href, title, label, children }) {
  return (
    <MaybeLink href={href} className={s.root}>
      {number && <div className={s.number}>{number}</div>}
      {label && <div className={s.label}>{label}</div>}
      {title && <div className={s.title}>{title}</div>}
      <div className={s.body}>{children}</div>
      {href && <div className={s.goto}>Read the whole story</div>}
    </MaybeLink>
  );
}
