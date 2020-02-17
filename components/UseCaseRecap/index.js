import Wrapper from 'components/Wrapper';
import s from './style.css';

export default function UseCaseRecap({ challenge, result, children }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.kicker}>The challenge</div>
        <div className={s.text}>{challenge}</div>
        <div className={s.kicker}>The result</div>
        <div className={s.text}>{result}</div>
        {children}
      </div>
    </Wrapper>
  );
}
