import s from './style.module.css';

export default function UiChrome({
  title = 'Acme Inc. - DatoCMS',
  url,
  children,
}) {
  return (
    <div className={s.root}>
      <div className={s.bar}>
        <div className={s.barButtons}>
          <div className={s.barButton} />
          <div className={s.barButton} />
          <div className={s.barButton} />
        </div>
        <div className={s.tab}>{title}</div>
      </div>
      {url && <div className={s.address}>{url}</div>}
      {children}
    </div>
  );
}
