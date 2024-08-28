import Button from 'components/Button';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import Hamburger from 'public/icons/regular/bars.svg';
import ChevronDown from 'public/icons/regular/chevron-down.svg';
import AlternativeLogo from 'public/images/brand-assets/svg/icon-text/color/color_full_logo_alt.svg';
import { useEffect, useState } from 'react';
import { getCookie } from 'utils/cookies';
import slugify from 'utils/slugify';
import s from './style.module.css';

const NavItem = ({ name, children }) => {
  const [open, setOpen] = useState(false);
  const lowecaseName = slugify(name);

  return (
    <div className={s.navItem} data-open={open}>
      <div className={s.navButtonWrapper}>
        <button
          className={s.navButton}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={lowecaseName}
        >
          {name}
        </button>
        <div className={s.chevron}>
          <ChevronDown />
        </div>
      </div>
      <div id={lowecaseName} className={s.panel} role="dialog">
        <div className={s.panelInner}>{children}</div>
      </div>
    </div>
  );
};

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

const GroupItem = ({
  href,
  title,
  description,
  imageUrl,
  isNew,
  excludeMobile,
}) => (
  <Link href={href}>
    <a className={s.groupItem} data-exclude-mobile={excludeMobile}>
      {imageUrl && (
        <div className={s.itemImage}>
          <LazyImage src={imageUrl} alt={title} />
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
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getCookie('datoAccountEmail'));
  }, []);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className={s.root} data-datocms-noindex>
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

      <nav className={s.nav} data-open={openNav}>
        <div className={s.logoWrapper}>
          <Link href="/">
            <a className={s.logo}>
              <AlternativeLogo />
            </a>
          </Link>

          <button
            type="button"
            className={s.hamburger}
            onClick={() => toggleNav()}
            aria-expanded={openNav}
            aria-controls="navList"
          >
            <Hamburger />
          </button>
        </div>

        <div id="navList" className={s.navList} aria-disabled={!openNav}>
          <NavItem name="Product">
            <PanelHighlight>
              <Group title="Platform">
                <GroupItem
                  href="/product"
                  title="Meet DatoCMS!"
                  description="Everything you need to know about the friendliest Headless CMS on the market."
                />
                <GroupItem href="/product" title="Explore the capabilities!" />
                <GroupItem href="/product-updates" title="See what’s new in DatoCMS" />
              </Group>
              <div className={s.ctaBox} data-exclude-mobile>
                <div className={s.ctaBoxShape}>
                  <div className={s.ctaImageWrapper}>
                    <div className={s.ctaImage}>
                      <LazyImage src={'/images/illustrations/box-things.svg'} />
                    </div>
                  </div>
                  <article className={s.ctaBody}>
                    <h3 className={s.ctaTitle}>Try DatoCMS for Free</h3>
                    <p className={s.ctaDescription}>
                      Try a no-strings-attached demo. No signup. No email. No
                      credit card.
                    </p>
                  </article>
                  <Button
                    className={s.ctaButton}
                    as="a"
                    p="tiny"
                    href="https://try.datocms.com/"
                  >
                    Launch interactive demo
                  </Button>
                </div>
              </div>
            </PanelHighlight>
            <PanelSlice columns="2">
              <Group columns="2" title="Features">
                <GroupItem
                  href="/features/headless-cms-graphql"
                  title="GraphQL API"
                  description="See why Headless CMS and GraphQL APIs are a match made in heaven."
                />
                <GroupItem
                  href="/features/structured-content-cms"
                  title="Structured text"
                  description="Meet (arguably) the best headless content editor out there."
                />
                <GroupItem
                  href="/features/headless-cms-multi-language"
                  title="Localization"
                  description="With i18n out of the box, meet your customers wherever they are."
                />
                <GroupItem
                  href="/features/dynamic-layouts"
                  title="Modular Content"
                  description="Check out the dynamic page building experience you’ll fall in love with."
                />
                <GroupLink text="Explore all capabilities" link="/product" />
              </Group>
              <Group title="Use cases">
                <GroupItem
                  href="/use-cases/headless-cms-websites"
                  title="Modern Websites"
                  description="Build bold with SEO, Assets, Live Previews, and more, out of the box."
                />
                <GroupItem
                  href="/use-cases/headless-ecommerce"
                  title="eCommerce"
                  description="Manage content and commerce experiences that fly off the shelf!"
                />
                <GroupItem
                  href="/use-cases/headless-cms-publishing"
                  title="Digital Publishing"
                  description="Ship content at scale with blazing fast speeds (or in real time)."
                />
                <GroupItem
                  href="/use-cases/headless-cms-knowledge-management"
                  title="Knowledge Management"
                  description="Simplify complex content for portals, wikis, intranets, and more."
                />
                {/* <GroupLink text="Explore all use cases" link="/" /> */}
              </Group>
              <Group title="Happy Team">
                <GroupItem
                  href="/team/best-cms-for-developers"
                  title="For Web Developers"
                  description="Stop settling for legacy web technologies that slow you down."
                />
                <GroupItem
                  href="/team/cms-digital-marketing"
                  title="For Digital Marketers"
                  description="Take control of your content with a unified platform for all channels."
                />
                <GroupItem
                  href="/team/content-creators"
                  title="For Content Creators"
                  description="Aggreggate all your content in one place and go live in seconds"
                />
                <GroupItem
                  href="/enterprise-headless-cms"
                  title="For Enterprise"
                  description="Join 25K+ teams, from governments to the F500, in trusting DatoCMS."
                />
              </Group>
            </PanelSlice>
          </NavItem>

          <NavItem name="Customers">
            <PanelHighlight>
              <Group title="DatoCMS in production">
                <GroupItem
                  href="/succeess-stories"
                  title="Powering content globally"
                  description="Hear real-world accounts of how DatoCMS is used at scale across the world."
                />
                <GroupItem href="/customers" title="Enterprise Case Studies" />
                <GroupItem href="/customer-stories" title="Casual Customer Chats" />
                <GroupItem href="/wall" title="Our Wall of Love" />
              </Group>
              <div className={s.quoteWrapper}>
                <div className={s.quote}>
                  <blockquote>
                    <p>
                    DatoCMS has become an indispensable tool for us. Fast, flexible, and a pleasure to use.
                    </p>
                    <footer>
                      <div className={s.quoteAvatar}>
                        <LazyImage
                          src={
                            'https://www.datocms-assets.com/205/1712274924-img_4983.jpg?auto=format&crop=faces&fit=crop&h=300&w=300'
                          }
                        />
                      </div>
                      <cite>
                        <div className={s.name}>Tim Chesney</div>
                        <div className={s.role}>Director at Make</div>
                      </cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </PanelHighlight>
            <PanelSlice columns={2}>
              <Group columns={2} title="Showcase projects">
                <GroupItem
                  href="/customers/polestar"
                  title="Polestar"
                  description="Serving content in 28 locales with 250+ editors across 35 custom roles."
                  imageUrl="https://www.datocms-assets.com/205/1648568107-webimage-31a550ca-084b-46f8-ac8d9741a15c737c.jpeg?auto=format&w=800"
                />
                <GroupItem
                  href="/customers/chillys"
                  title="Chilly’s"
                  description="Unlocking 166%+ growth in annual revenue with 2M+ monthly users."
                  imageUrl="https://www.datocms-assets.com/205/1582294156-cover-chillys.jpg?auto=format&w=800"
                />
                <GroupItem
                  href="/customers/hashicorp"
                  title="Hashicorp"
                  description="Handling 2TB of traffic, with 5M+ monthly API calls on 35K+ records."
                  imageUrl="https://www.datocms-assets.com/205/1581953189-1569253200-swilson-hc19.png?auto=format&w=800"
                />
                <GroupItem
                  href="/customers/arduino"
                  title="Arduino"
                  description="Reducing lines of code by 92,5% while gaining 8x faster loading times."
                  imageUrl="https://www.datocms-assets.com/205/1581958110-copy-of-arduino-teacher-students-978x653.jpeg?auto=format&w=800"
                />
                <GroupLink text="Explore all enterprise case studies" link="/customers" />
              </Group>
            </PanelSlice>
          </NavItem>

          <NavItem name="Partners">
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
              <div className={s.ctaBox}>
                <div className={s.ctaBoxShape}>
                  <div className={s.ctaImageWrapper}>
                    <div className={s.ctaImage}>
                      <LazyImage src={'/images/illustrations/faces-2.svg'} />
                    </div>
                  </div>
                  <article className={s.ctaBody}>
                    <h3 className={s.ctaTitle}>Join The Network</h3>
                    <p className={s.ctaDescription}>
                      Explore the benefits you unlock when you join our partner
                      ecosystem.
                    </p>
                  </article>
                  <Button
                    className={s.ctaButton}
                    as="a"
                    p="tiny"
                    href="/partner-program"
                  >
                    Become a partner
                  </Button>
                </div>
              </div>
            </PanelHighlight>
            <PanelSlice columns={2}>
              <Group columns={2} title="Showcase projects">
                <GroupItem
                  href="/"
                  title="MDLBeast by November Five"
                  description="Saudi Arabia’s largest entertainment company uses blocks for a stellar UX."
                  imageUrl="https://www.datocms-assets.com/205/1685971352-mdlbeast.jpg?auto=format&w=800"
                />
                <GroupItem
                  href="/"
                  title="Toca Boca by Fully Studios"
                  description="Leading game developer gets a new website on Next.js and AWS."
                  imageUrl="https://www.datocms-assets.com/205/1715249902-project_img.png?auto=format&w=800"
                />
                <GroupItem
                  href="/"
                  title="L’Officiel by Cantiere Creativo"
                  description="Global fashion magazine runs 30+ online magazines from a single CMS instance."
                  imageUrl="https://www.datocms-assets.com/205/1640195611-home-page-fr.png?auto=format&w=800"
                />
                <GroupItem
                  href="/"
                  title="Wild by Rotate°"
                  description="Subscription-first cosmetic brand gets a world-class content overhaul."
                  imageUrl="https://www.datocms-assets.com/205/1718048731-1661957070-wild_02.jpg?auto=format&w=800"
                />
                <GroupLink text="Explore all partner projects" link="/" />
              </Group>
            </PanelSlice>
          </NavItem>

          <NavItem name="Developers">
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
                  isNew
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
                <div className={s.integrations}>
                  <Link href="/">
                    <a className={s.integrationsItem}>
                      <LazyImage
                        src={'/images/logos/next-squared.svg'}
                        alt="Next.js"
                        className={s.integrationsImage}
                      />
                      <p className={s.techName}>Next.js</p>
                    </a>
                  </Link>
                  <Link href="/">
                    <a className={s.integrationsItem}>
                      <LazyImage
                        src={'/images/logos/svelte-squared.svg'}
                        alt="SvelteKit"
                        className={s.integrationsImage}
                      />
                      <p className={s.techName}>SvelteKit</p>
                    </a>
                  </Link>
                  <Link href="/">
                    <a className={s.integrationsItem}>
                      <LazyImage
                        src={'/images/logos/astro-squared.svg'}
                        alt="Next.js"
                        className={s.integrationsImage}
                      />
                      <p className={s.techName}>Astro</p>
                    </a>
                  </Link>
                  <Link href="/">
                    <a className={s.integrationsItem}>
                      <LazyImage
                        src={'/images/logos/nuxt-squared.svg'}
                        alt="Nuxt"
                        className={s.integrationsImage}
                      />
                      <p className={s.techName}>Nuxt</p>
                    </a>
                  </Link>
                </div>
              </Group>
            </PanelHighlight>
          </NavItem>

          <NavItem name="Resources">
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
                  title="Deep Dive into Structured Text in DatoCMS"
                  description=""
                  imageUrl="https://image.mux.com/Yc4esLEsoQszLQLgkOKPCmVLARxnrMzV/thumbnail.jpg?width=918"
                />
                <GroupItem
                  href="/"
                  title="Building Pages and Deep Dive into Modular Content"
                  description=""
                  imageUrl="https://image.mux.com/W5jgwKq95fqBS7kmfolmRJHrUx4jtEex/thumbnail.jpg?width=918"
                />
                <GroupItem
                  href="/"
                  title="Videos and Video Optimizations"
                  description=""
                  imageUrl="https://image.mux.com/P1SA01aSHtY1jzHrASAu00jdfIH5OWF01Ih/thumbnail.jpg?width=918"
                />
                <GroupItem
                  href="/"
                  title="Intro to the Schema Builder"
                  description=""
                  imageUrl="https://image.mux.com/ZXrCcv53t00n02f5yS500siKW102xdfJqG025/thumbnail.jpg?width=918"
                />
                <GroupLink text="Explore all Partner projects" link="/" />
              </Group>
            </PanelSlice>
          </NavItem>

          <Link href="/pricing">
            <a className={s.navLink}>
              <span>Pricing</span>
            </a>
          </Link>
        </div>

        <div className={s.navActions}>
          <Link href="/contact">
            <a className={s.navLink}>Contact sales</a>
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
                className={s.navLink}
                data-exclude-mobile
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
    </div>
  );
}
