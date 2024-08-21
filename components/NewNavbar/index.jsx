import { default as classnames, default as cn } from 'classnames';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
// import FullLogo from 'public/images/full_logo.svg';
import AlternativeLogo from 'public/images/brand-assets/svg/icon-text/color/color_full_logo_alt.svg';
import ContentCreators from 'public/images/illustrations/content-editors2.svg';
import Developers from 'public/images/illustrations/developers-2.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';
import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import RealTime from 'public/images/illustrations/live-31.svg';
import DataIntegrity from 'public/images/illustrations/lock2.svg';
import Marketers from 'public/images/illustrations/marketers.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import StructuredText from 'public/images/illustrations/scontent.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Workflows from 'public/images/illustrations/workflows.svg';
import Logo from 'public/images/logo.svg';
import { useEffect, useState } from 'react';
import { getCookie } from 'utils/cookies';
import s from './style.module.css';

import External from 'public/icons/regular/external-link.svg';


const Panel = ({ children }) => (
  <div className={s.panel}>
    <div className={s.panelInner}>{children}</div>
  </div>
);

const PanelGroup = ({ columns = 1, title, children }) => (
  <div data-col={columns} className={s.panelGroup}>
    {title && <h3 className={s.groupTitle}>{title}</h3>}
    {children}
  </div>
);

const PanelHighlight = ({ orientation, children }) => (
  <div data-orientation={orientation} className={s.highlight}>
    {children}
  </div>
);

const PanelSlice = ({ columns = 1, children }) => (
  <div className={s.slice} data-col={columns}>
    {children}
  </div>
);

const GroupItem = ({ href, title, description, imageUrl, isNew }) => (
  <Link href={href}>
    <a className={s.item}>
      {imageUrl && (
        <div className={s.itemImage}>
          <img src={imageUrl} alt={title} /> aaa
        </div>
      )}
      <div className={s.itemBody}>
        <div className={s.itemTitle}>
          <h4>{title}</h4>
          {isNew && <span className={s.isNew}>New</span>}
        </div>
        {description && <p className={s.itemDescription}>{description}</p>}
      </div>
    </a>
  </Link>
);

const GroupLink = ({ text, link }) => (
  <Link href={link}>
    <a className={s.groupLink}>
      <span>{text}</span>
      <span>→</span>
    </a>
  </Link>
);

export default function Newnavbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getCookie('datoAccountEmail'));
  }, []);

  return (
    <div className={classnames(s.root)} data-datocms-noindex>
      {true && (
        <Link href="/webinars/how-to-use-structured-text-on-datocms">
          <a className={s.notice}>
            <Wrapper>
              <strong>
                📅 Want to learn how to use our new Structured Text field with
                Next.js?
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
            </Wrapper>
          </a>
        </Link>
      )}

      <Wrapper>
        <nav className={s.nav}>
          <Link href="/">
            <a className={s.logo}>
              <AlternativeLogo />
            </a>
          </Link>
          <div className={s.navList}>
            <div className={s.navItemGroup}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton}>Product</button>
              </div>
              <Panel>
                <PanelHighlight>
                  <PanelGroup title="Platform">
                    <GroupItem
                      href="/product"
                      title="Meet DatoCMS!"
                      description="Everything you need to know about the friendliest Headless CMS on the market."
                      isNew
                    />
                    <GroupItem href="/" title="Explore the capabilities!" />
                    <GroupItem href="/" title="See what’s new in DatoCMS" />
                  </PanelGroup>
                </PanelHighlight>
                <PanelSlice columns="2">
                  <PanelGroup columns={2} title="Features">
                    <GroupItem
                      href="/"
                      title="GraphQL API"
                      description="Understand how our GraphQL APIs level up your developer experience."
                    />
                    <GroupItem
                      href="/"
                      title="Structured text"
                      description="Meet (arguably) the best content editor experience in Headless CMS."
                    />
                    <GroupLink text="Explore all features" link="/" />
                  </PanelGroup>
                  <PanelGroup columns={1} title="Features">
                    <GroupItem
                      href="/"
                      title="GraphQL API"
                      description="Understand how our GraphQL APIs level up your developer experience."
                    />
                    <GroupItem
                      href="/"
                      title="Structured text"
                      description="Meet (arguably) the best content editor experience in Headless CMS."
                    />
                    <GroupLink text="Explore all features" link="/" />
                  </PanelGroup>
                  <PanelGroup columns={1} title="Features">
                    <GroupItem
                      href="/"
                      title="GraphQL API"
                      description="Understand how our GraphQL APIs level up your developer experience."
                    />
                    <GroupItem
                      href="/"
                      title="Structured text"
                      description="Meet (arguably) the best content editor experience in Headless CMS."
                    />
                    <GroupLink text="Explore all features" link="/" />
                  </PanelGroup>
                </PanelSlice>
              </Panel>
            </div>
          </div>

          <div className={s.navActions}>
            <Link href="/pricing">
              <a className={s.navEntry}>
                <span>Pricing</span>
              </a>
            </Link>

            <Link href="/contact">
              <a className={cn(s.navEntry, loggedIn && s.entryContact)}>
                <span>Contact sales</span>
              </a>
            </Link>

            {loggedIn ? (
              <>
                <Button as="a" p="small" href="https://dashboard.datocms.com/">
                  Enter dashboard
                </Button>
              </>
            ) : (
              <>
                <a
                  href="https://dashboard.datocms.com/login"
                  className={cn(s.navEntry, s.entryContact)}
                >
                  <span>Log in</span>
                </a>
                <Button as="a" p="small" href="/pricing">
                  Get started
                </Button>
              </>
            )}
          </div>
        </nav>
      </Wrapper>
    </div>
  );
}
