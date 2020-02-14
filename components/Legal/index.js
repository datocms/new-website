import Wrapper from 'components/Wrapper';

import s from './style.css';

export default function Legal({ children }) {
  return (
    <Wrapper>
      <div className={s.body}>
        {children}
      </div>
    </Wrapper>
  );
}