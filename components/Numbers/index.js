import Wrapper from 'components/Wrapper';
import MaybeLink from 'components/MaybeLink';
import s from './style.module.css';

export default function Numbers({ children }) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.rootBlocks}>{children}</div>
        </div>
      </Wrapper>
    </div>
  );
}

export function Block({ image, title, href, children, logo: Logo }) {
  return (
    <MaybeLink href={href} className={s.block}>
      {image}
      <div className={s.blockTitle}>{title}</div>
      {children}
      {Logo && <Logo className={s.logo} />}
    </MaybeLink>
  );
}
