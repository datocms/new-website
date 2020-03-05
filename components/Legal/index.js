import Wrapper from 'components/Wrapper';

import s from './style.module.css';

export default function Legal({ children }) {
  return (
    <Wrapper>
      <div className={s.body}>{children}</div>
    </Wrapper>
  );
}
