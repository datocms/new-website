import Wrapper from 'components/Wrapper';
import s from './style.module.css';

export default function EnterpriseStrip({
  kicker,
  title,
  description,
  children,
}) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.intro}>
            {kicker && <h2 className={s.kicker}>{kicker}</h2>}
            <h3 className={s.introTitle}>{title}</h3>
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
      <h4 className={s.personasTitle}>{title}</h4>
      <div className={s.personasBody}>{description}</div>
    </div>
  );
}
