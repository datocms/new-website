import { default as classnames, default as cn } from 'classnames';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import External from 'public/icons/regular/external-link.svg';
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

const Panel = ({ children }) => (
  <div className={s.panel}>
    <div className={s.panelInner}>{children}</div>
  </div>
);

const PanelHighlight = ({ orientation = 'vertical', children }) => (
  <div data-orientation={orientation} className={s.panelHighlight}>
    {children}
  </div>
);

const PanelSlice = ({ columns = 1, children }) => (
  <div className={s.panelSlice} data-col={columns}>
    {children}
  </div>
);

const Group = ({ columns = 1, title, children }) => (
  <div data-col={columns} className={s.group}>
    {title && <h3 className={s.groupTitle}>{title}</h3>}
    {children}
  </div>
);

const GroupItem = ({ href, title, description, imageUrl, isNew }) => (
  <Link href={href}>
    <a className={s.groupItem}>
      {imageUrl && (
        <div className={s.itemImage}>
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <article className={s.itemBody}>
        <div className={s.itemTitle}>
          <h4>{title}</h4>
          {isNew && <span className={s.isNew}>New</span>}
        </div>
        {description && <p className={s.itemDescription}>{description}</p>}
      </article>
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
      {false && (
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
            <div className={s.navItem}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton} type="button">
                  Product
                </button>
              </div>
              <Panel>
                <PanelHighlight>
                  <Group title="Platform">
                    <GroupItem
                      href="/product"
                      title="Meet DatoCMS!"
                      description="Everything you need to know about the friendliest Headless CMS on the market."
                      isNew
                    />
                    <GroupItem href="/" title="Explore the capabilities!" />
                    <GroupItem href="/" title="See what’s new in DatoCMS" />
                  </Group>
                </PanelHighlight>
                <PanelSlice columns="2">
                  <Group columns="2" title="Features">
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
                  </Group>
                  <Group title="Use cases">
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
                  </Group>
                  <Group title="Happy Team">
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
                  </Group>
                </PanelSlice>
              </Panel>
            </div>

            <div className={s.navItem}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton} type="button">
                  Customers
                </button>
              </div>
              <Panel>
                <PanelHighlight>
                  <Group title="DatoCMS in production">
                    <GroupItem
                      href="/product"
                      title="Powering experiences globally"
                      description="Hear real-world accounts of how DatoCMS is used at scale across the world."
                    />
                    <GroupItem href="/" title="Enterprise Case Studies" />
                    <GroupItem href="/" title="Casual Customer Chats" />
                    <GroupItem href="/" title="Our Wall of Love" />
                  </Group>
                </PanelHighlight>
                <PanelSlice columns={2}>
                  <Group columns={2} title="Showcase projects">
                    <GroupItem
                      href="/"
                      title="Polestar"
                      description="Serving users globally in 28 locales with 250+ editors across 35 custom roles."
                      imageUrl="a"
                    />
                    <GroupItem
                      href="/"
                      title="Chilly’s"
                      description="Unlocking 166%+ growth in annual revenue for 2M+ monthly users."
                      imageUrl="b"
                    />
                    <GroupItem
                      href="/"
                      title="Hashicorp"
                      description="Handling 2TB of traffic, with 5M+ monthly API calls on 35K+ records."
                      imageUrl="c"
                    />
                    <GroupItem
                      href="/"
                      title="Arduino"
                      description="Reducing lines of code needed by 92,5% while gaining 8x faster loading times."
                      imageUrl="d"
                    />
                    <GroupLink text="Explore all features" link="/" />
                  </Group>
                </PanelSlice>
              </Panel>
            </div>

            <div className={s.navItem}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton} type="button">
                  Parners
                </button>
              </div>
              <Panel>
                <PanelHighlight>
                  <Group title="DatoCMS ❤️ Partners">
                    <GroupItem
                      href="/product"
                      title="Our Partner Network"
                      description="Our most successful customers ship their digital products faster via our partners."
                    />
                    <GroupItem href="/" title="Explore Agency Partners" />
                    <GroupItem href="/" title="Explore Tech Partners" />
                  </Group>
                </PanelHighlight>
                <PanelSlice columns={2}>
                  <Group columns={2} title="Showcase projects">
                    <GroupItem
                      href="/"
                      title="MDLBeast by November Five"
                      description="Saudi Arabia’s largest entertainment company uses blocks for a stellar UX."
                      imageUrl="a"
                    />
                    <GroupItem
                      href="/"
                      title="Toca Boca by Fully Studios"
                      description="Leading game developer gets a new website on Next.js and AWS."
                      imageUrl="b"
                    />
                    <GroupItem
                      href="/"
                      title="L’Officiel by Cantiere Creativo"
                      description="Global fashion magazine runs 30+ online magazines from a single CMS instance."
                      imageUrl="c"
                    />
                    <GroupItem
                      href="/"
                      title="Wild by Rotate°"
                      description="Subscription-first cosmetic brand gets a world-class content overhaul."
                      imageUrl="d"
                    />
                    <GroupLink text="Explore all Partner projects" link="/" />
                  </Group>
                </PanelSlice>
              </Panel>
            </div>

            <div className={s.navItem}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton} type="button">
                  Developers
                </button>
              </div>
              <Panel>
                <PanelSlice columns={1}>
                  <Group title="Documentation">
                    <GroupItem
                      href="/"
                      title="GraphQL API Reference"
                      description="Learn how to fetch your content into any frontend project."
                    />
                    <GroupItem
                      href="/"
                      title="Management API Reference"
                      description="Handle creating, updating, deleting, and fetching content of your projects via API."
                    />
                    <GroupItem
                      href="/"
                      title="Assets API Reference"
                      description="Get up to speed with managing & optimizing images and videos in DatoCMS."
                    />
                    <GroupItem
                      href="/"
                      title="Modelling Your Schema"
                      description="Build your administrative area and define the structure of your content."
                    />
                    <GroupLink text="Explore all features" link="/" />
                  </Group>
                </PanelSlice>
                <PanelSlice columns={2}>
                  <Group columns={2} title="Extensibility">
                    <GroupItem
                      href="/"
                      title="Official Starters"
                      description="Boilerplate templates to get you from zero-to-live within minutes."
                    />
                    <GroupItem
                      href="/"
                      title="Hosting & Builds"
                      description="Server, serverless, or static - we've got you and your stack covered."
                    />
                    <GroupItem
                      href="/"
                      title="Plugins"
                      description="From web previews to SEO, easily expand DatoCMS’s capabilities."
                    />
                    <GroupItem
                      href="/"
                      title="Enterprise Apps"
                      description="Keep your CMS secure with SSO, custom assets, and more."
                    />
                  </Group>
                  <Group columns={2} title="Community & support">
                    <GroupItem
                      href="/"
                      title="Community Forum"
                      description="Get support, request a feature, or see what we’re working on."
                    />
                    <GroupItem
                      href="/"
                      title="Slack Channel"
                      description="Connect with 3K+ other developers using DatoCMS in production."
                    />
                  </Group>
                </PanelSlice>

                <PanelHighlight orientation="horizontal">
                  <Group columns={3} title="Popular integrations">
                    ...
                  </Group>
                </PanelHighlight>
              </Panel>
            </div>

            <div className={s.navItem}>
              <div className={s.navButtonWrapper}>
                <button className={s.navButton} type="button">
                  Resources
                </button>
              </div>
              <Panel>
                <PanelHighlight>
                  <Group title="Core resources">
                    <GroupItem
                      href="/"
                      title="How to DatoCMS"
                      description="Central hub covering everything you need to become a power user."
                    />
                    <GroupItem
                      href="/"
                      title="Compare Headless CMS"
                      description="Not sure which CMS is the right one for you? Let us help you decide. No bias."
                    />
                  </Group>
                  <Group title="Featured posts">
                    <GroupItem
                      href="/"
                      title="Multilingual site with Next.js"
                      description="Let’s build a localized Next.js and GraphQL website with DatoCMS."
                    />
                    <GroupItem
                      href="/"
                      title="Introducing Cache Tags"
                      description="No more costly and inefficient time-based invalidation methods."
                    />
                    <GroupLink text="Explore the Blog" link="/" />
                  </Group>
                </PanelHighlight>
                <PanelSlice columns={2}>
                  <Group columns={2} title="Featured guides">
                    <GroupItem
                      href="/"
                      title="User Guide Title"
                      description="Saudi Arabia’s largest entertainment company uses blocks for a stellar UX."
                      imageUrl="a"
                    />
                    <GroupItem
                      href="/"
                      title="User Guide Title"
                      description="Leading game developer gets a new website on Next.js and AWS."
                      imageUrl="b"
                    />
                    <GroupItem
                      href="/"
                      title="User Guide Title"
                      description="Global fashion magazine runs 30+ online magazines from a single CMS instance."
                      imageUrl="c"
                    />
                    <GroupItem
                      href="/"
                      title="User Guide Title"
                      description="Subscription-first cosmetic brand gets a world-class content overhaul."
                      imageUrl="d"
                    />
                    <GroupLink text="Explore all Partner projects" link="/" />
                  </Group>
                </PanelSlice>
              </Panel>
            </div>

            <Link href="/pricing">
              <a className={s.navEntry}>
                <span>Pricing</span>
              </a>
            </Link>
          </div>

          <div className={s.navActions}>
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
