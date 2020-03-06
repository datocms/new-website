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

export function Block({ image, title, href, as, children, logo: Logo }) {
  return (
    <MaybeLink as={as} href={href} className={s.block}>
      {image}
      <div className={s.blockTitle}>{title}</div>
      {children}
      {Logo && <Logo preserveAspectRatio="meet" className={s.logo} />}
    </MaybeLink>
  );
}
