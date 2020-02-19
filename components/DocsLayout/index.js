import BaseLayout from 'components/BaseLayout';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.css';
import SearchIcon from 'public/icons/regular/search.svg';

export default function DocsLayout({ sidebar, children }) {
  return (
    <BaseLayout>
      <div className={s.root}>
        <div className={s.sidebar}>
          <Link href="/">
            <a className={s.logo}>
              <FullLogo height={30} />
            </a>
          </Link>
          <div className={s.innerSidebar}>{sidebar}</div>
        </div>
        <div className={s.contentWrapper}>
          <div className={s.mainHeader}>
            <SearchIcon />
          </div>
          <div className={s.articleContainer}>
            <div className={s.article}>{children}</div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
