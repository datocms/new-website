import BaseLayout from 'components/BaseLayout';
import DocSearch from 'components/DocSearch';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import SupportIcon from 'public/icons/regular/headset.svg';
import StatusIcon from 'public/icons/regular/tachometer.svg';

export default function DocsLayout({ sidebar, children, preview }) {
  return (
    <BaseLayout preview={preview}>
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
          <DocSearch />
          <div className={s.mainHeader}>
            <ul>
              <li>
                <Link href="/support">
                  <a>
                    <SupportIcon />
                    Ask for help!
                  </a>
                </Link>
              </li>
              <li>
                <a href="https://status.datocms.com" target="_blank">
                  <StatusIcon />
                  Status page
                </a>
              </li>
            </ul>
          </div>
          <div className={s.container}>
            {children}
            <div className={s.footer}>
              <div className={s.footerTitle}>Questions?</div>
              <div className={s.footerBody}>
                We're always happy to help with code or other questions you
                might have. Search our{' '}
                <Link href="/docs">
                  <a>documentation</a>
                </Link>
                , <a href="https://community.datocms.com">forum</a>,{' '}
                <Link href="/support">
                  <a>contact support</a>
                </Link>
                , or{' '}
                <Link href="/enterprise#form">
                  <a>connect with our sales team</a>
                </Link>
                . You can chat live with other developers in our{' '}
                <Link href="/slack">
                  <a>Slack channel</a>
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
