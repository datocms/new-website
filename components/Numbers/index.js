import Wrapper from 'components/Wrapper';
import s from './style.css';
import Link from 'next/link';

const MaybeLink = ({ href, children, ...other }) =>
  href ? (
    <Link href={href}>
      <a {...other}>{children}</a>
    </Link>
  ) : (
    <div {...other}>{children}</div>
  );

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
      {Logo && <Logo preserveAspectRatio="meet" className={s.logo} />}
    </MaybeLink>
  );
}
