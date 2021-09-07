import BaseLayout from 'components/BaseLayout';
import DocSearch from 'components/DocSearch';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import SupportIcon from 'public/icons/regular/headset.svg';
import StatusIcon from 'public/icons/regular/tachometer.svg';
import LanguagePicker from 'components/LanguagePicker';

export default function DocsLayout({
  sidebar,
  children,
  preview,
  languageSwitch,
}) {
  const content = (
    <div className={s.container}>
      {children}
      <div className={s.footer} data-datocms-noindex>
        <div className={s.footerTitle}>Questions?</div>
        <div className={s.footerBody}>
          We&#39;re always happy to help with code or other questions you might
          have. Search our{' '}
          <Link href="/docs">
            <a>documentation</a>
          </Link>
          , <a href="https://community.datocms.com">forum</a>,{' '}
          <Link href="/support">
            <a>contact support</a>
          </Link>
          , or{' '}
          <Link href="/enterprise-headless-cms#form">
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
  );
  return (
    <BaseLayout preview={preview}>
      <div className={s.root}>
        <div className={s.sidebar}>
          <Link href="/">
            <a className={s.logo}>
              <FullLogo height={30} />
            </a>
          </Link>
          <div className={s.innerSidebar} data-datocms-noindex>
            {sidebar}
            {false && (
              <Link href="/webinars/how-to-use-structured-text-on-datocms">
                <a className={s.notice}>
                  <strong>
                    📅 Want to learn how to use our new Structured Text field
                    with Next.js?
                  </strong>{' '}
                  Follow our webinar on Wednesday,{' '}
                  {new Date('2021-03-10T18:00:00+01:00').toLocaleTimeString(
                    'en-US',
                    {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    },
                  )}
                </a>
              </Link>
            )}
          </div>
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
                <a
                  href="https://status.datocms.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <StatusIcon />
                  Status page
                </a>
              </li>
            </ul>
          </div>
          {languageSwitch ? (
            <LanguagePicker>{content}</LanguagePicker>
          ) : (
            content
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
