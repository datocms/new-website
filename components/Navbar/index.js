import Wrapper from 'components/Wrapper';
import FullLogo from '/public/images/full_logo.svg';
import Link from 'next/link'

import s from './style.css';
import next from 'next';

export default function Navbar() {
  return (
    <Wrapper>
      <div className={s.root}>
        <FullLogo className={s.logo} width={120} height="auto" />
        <div className={s.entries}>
          <div className={s.group}>
            <div className={s.groupTitle}>Why DatoCMS</div>
            <div className={s.groupEntries}>
              <Link href="/">Solutions</Link>
            </div>
          </div>
          <Link href="/foo">Case studies</Link>
          <Link href="/foo">Learn</Link>
          <Link href="/foo">Integrations</Link>
          <Link href="/foo">Enterprise</Link>
          <Link href="/foo">Blog</Link>
          <Link href="/foo">Pricing</Link>
        </div>
      </div>
    </Wrapper>
  );
}
