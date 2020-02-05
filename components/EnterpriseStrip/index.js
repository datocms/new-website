import s from './style.css';
import Wrapper from 'components/Wrapper';

export default function EnterpriseStrip({ title, description, children }) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.intro}>
            <div className={s.introTitle}>{title}</div>
            <div className={s.introBody}>{description}</div>
          </div>
          <div className={s.picker}>{children}</div>
        </div>
      </Wrapper>
    </div>
  );
}

export function Point({ title, description }) {
  return (
    <div className={s.personas}>
      <div className={s.personasTitle}>{title}</div>
      <div className={s.personasBody}>{description}</div>
    </div>
  );
}
