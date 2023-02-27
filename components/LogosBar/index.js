import Wrapper from 'components/Wrapper';
import s from './style.module.css';

export default function LogosBar({ title, clients }) {
  return (
    <Wrapper>
      {title && <div className={s.title}>{title}</div>}
      <div className={s.root}>
        {clients.map((client, i) => (
          <div className={s.logo} key={i}>
            {client}
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
