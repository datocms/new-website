import BaseLayout from 'components/BaseLayout';
import DocSearch from 'components/DocSearch';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.css';

export default function DocsLayout({ sidebar, children }) {
  return (
    <BaseLayout>
      <div className={s.root}>
        <div className={s.sidebar}>
          <Link href="/docs">
            <a className={s.logo}>
              <FullLogo height={30} />
            </a>
          </Link>
          <div className={s.innerSidebar}>{sidebar}</div>
        </div>
        <div className={s.contentWrapper}>
          <DocSearch />
          <div className={s.mainHeader}>
            <ul>
              <li>
                <Link href="/">
                  <a>Support</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>APIs &amp; SDK</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>Sign in</a>
                </Link>
              </li>
            </ul>
          </div>
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
