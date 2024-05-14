import s from './style.module.css';

export default function Numbers({ children }) {
  return (
    <div className={s.root}>
      <div className={s.rootInner}>
        <div className={s.rootBlocks}>{children}</div>
      </div>
    </div>
  );
}

export function Block({ title, children }) {
  return (
    <div className={s.block}>
      <div className={s.blockTitle}>{title}</div>
      <div className={s.blockResult}>{children}</div>
    </div>
  );
}
