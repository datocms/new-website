import Wrapper from 'components/Wrapper';
import s from './style.css';

export default function Highlights({ title, children }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.rootTitle}>{title}</div>
        <div className={s.rootBlocks}>{children}</div>
      </div>
    </Wrapper>
  );
}

export function Block({ image, title, children }) {
  return (
    <div className={s.block}>
      {image}
      <div className={s.blockTitle}>{title}</div>
      {children}
    </div>
  );
}
