import cn from 'classnames';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import Hamburger from 'public/icons/regular/bars.svg';
import FullLogo from 'public/images/full_logo.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';
import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import RealTime from 'public/images/illustrations/live-31.svg';
import DataIntegrity from 'public/images/illustrations/lock2.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import StructuredText from 'public/images/illustrations/scontent.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Workflows from 'public/images/illustrations/workflows.svg';

import { useCallback, useEffect, useState } from 'react';
import { getCookie } from 'utils/cookies';
import s from './style.module.css';

const Group = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.group}>
      <button
        type="button"
        className={cn(s.groupTitle, s.groupTitleHandle, {
          [s.handleOpen]: open,
        })}
        onClick={() => setOpen((x) => !x)}
      >
        {title}
      </button>
      {open && <div className={s.groupContent}>{children}</div>}
    </div>
  );
};

const BigLink = ({ children, href }) => {
  return (
    <div className={s.group}>
      <Link href={href}>
        <a className={s.groupTitle}>{children}</a>
      </Link>
    </div>
  );
};

const Resource = ({ href, title, target, description }) => {
  const content = (
    <>
      <div className={s.resourceTitle}>{title}</div>
      <div className={s.resourceDesc}>{description}</div>
    </>
  );

  return target ? (
    <a className={s.resource} href={href} target={target}>
      {content}
    </a>
  ) : (
    <Link href={href}>
      <a className={s.resource}>{content}</a>
    </Link>
  );
};

const Feature = ({ href, icon: Icon, title, description, keyword }) => (
  <Link href={href}>
    <a className={s.feature} title={keyword}>
      <div className={s.featureIcon}>
        <Icon />
      </div>
      <div className={s.featureBody}>
        <div className={s.featureTitle}>{title}</div>
        <div className={s.featureDescription}>{description}</div>
      </div>
    </a>
  </Link>
);

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getCookie('datoAccountEmail'));
  }, []);

  const toggleVisibility = useCallback(() => {
    setVisible((v) => !v);
  }, [setVisible]);

  return (
    <>
      {visible && (
        <div className={s.overlay} onClick={() => setVisible(false)} />
      )}
      <div className={cn(s.root)} data-datocms-noindex>
        <Wrapper>
          <div className={s.innerRoot}>
            <Link href="/">
              <a className={s.logo}>
                <FullLogo />
              </a>
            </Link>
            <div className={s.space} />
            <button
              type="button"
              className={s.hamburger}
              onClick={toggleVisibility}
            >
              <Hamburger />
            </button>
          </div>
        </Wrapper>
        {visible && (
          <>
            <div className={s.pane}>
              <Wrapper>
                <Group title="Product">
                  <Link href="/product">
                    <a className={s.extraLink}>Overview</a>
                  </Link>

                  <div className={s.sectionTitle}>Team</div>
                  <Link href="/team/best-cms-for-developers">
                    <a className={s.extraLink}>For developers</a>
                  </Link>
                  <Link href="/team/cms-digital-marketing">
                    <a className={s.extraLink}>For digital marketers</a>
                  </Link>
                  <Link href="/team/content-creators">
                    <a className={s.extraLink}>For content creators</a>
                  </Link>

                  <div className={s.sectionTitle}>Features</div>
                  <Feature
                    icon={Cdn}
                    title="Worldwide CDN"
                    keyword="Fastest headless CMS"
                    href="/features/worldwide-cdn"
                    description="Performant, secure, and close to every customer"
                  />

                  <Feature
                    icon={GraphQl}
                    title="GraphQL Content API"
                    keyword="Headless CMS Graphql"
                    href="/features/headless-cms-graphql"
                    description="Develop faster with powerful developer tools"
                  />

                  <Feature
                    icon={Image}
                    title="Images API"
                    keyword="Images API"
                    href="/features/images-api"
                    description="Endless image transformations at your disposal"
                  />

                  <Feature
                    icon={Video}
                    title="Video streaming/encoding"
                    keyword="Video API"
                    href="/features/video-api"
                    description="Produce videos and serve them fast to any device"
                  />

                  <Feature
                    icon={Languages}
                    title="Multi-language"
                    keyword="Headless CMS multi language"
                    href="/features/headless-cms-multi-language"
                    description="Reach your global audience with localized content"
                  />

                  <Feature
                    icon={Layouts}
                    title="Dynamic layouts"
                    keyword="Dynamic layouts CMS"
                    href="/features/dynamic-layouts"
                    description="Easily build dynamic layouts for landing pages"
                  />

                  <Feature
                    icon={DataIntegrity}
                    title="Content integrity"
                    keyword="Content integrity CMS"
                    href="/features/data-integrity"
                    description="Clean content is timeless content"
                  />

                  <Feature
                    icon={Workflows}
                    title="Workflows"
                    keyword="Workflow CMS"
                    isNew
                    href="/features/workflow-cms"
                    description="Supercharge your content approval process"
                  />

                  <Feature
                    icon={RealTime}
                    title="Real-time updates"
                    keyword="Real-time API"
                    isNew
                    href="/features/real-time-api"
                    description="Live changes to content on production website"
                  />

                  <Feature
                    icon={StructuredText}
                    title="Structured text"
                    keyword="Structured content CMS"
                    isNew
                    href="/features/structured-content-cms"
                    description="Freedom for editors, control for developers"
                  />

                  <div className={s.sectionTitle}>Enterprise</div>
                  <Link href="/enterprise-headless-cms">
                    <a className={s.extraLink}>DatoCMS for Enterprise</a>
                  </Link>
                </Group>

                <BigLink href="/success-stories">Customers</BigLink>

                <Group title="Learn">
                  <div className={s.twocols}>
                    <Resource
                      title="Documentation"
                      description="Guides, tutorials and API reference"
                      href="/docs"
                    />

                    <Resource
                      title="Blog"
                      description="Culture, learnings, and announcements"
                      href="/blog"
                    />

                    <Resource
                      title="Product updates"
                      description="Changelog for features and improvements"
                      href="/product-updates"
                    />

                    <Resource
                      title="User Guides"
                      description="Simple product walkthroughs for editors"
                      href="/user-guides"
                    />

                    <Resource
                      title="Academy"
                      description="Deep dive into the concepts around headless"
                      href="/academy"
                    />

                    <Resource
                      title="Community forum"
                      description="Ask questions/discuss with your peers"
                      href="https://community.datocms.com"
                      target="_blank"
                    />
                    <Resource
                      title="Slack channel"
                      description="Chat live with other devs"
                      href="/slack"
                    />
                    <Resource
                      title="Support"
                      description="Got questions? Get in touch!"
                      href="/support"
                    />
                  </div>
                </Group>

                <Group title="Marketplace">
                  <div className={s.twocols}>
                    <Resource
                      href="/marketplace/starters"
                      title="Starters"
                      description="Start with a fully configured DatoCMS project"
                    />
                    <Resource
                      href="/marketplace/plugins"
                      title="Plugins"
                      description="Easily expand the capabilities of DatoCMS"
                    />
                    <Resource
                      href="/marketplace/hosting"
                      title="Hosting &amp; Builds"
                      description="No matter the stack you're using, we've got you covered"
                    />

                    <Resource
                      href="/marketplace/enterprise"
                      title="Enterprise apps"
                      description="Keep your company data secure"
                    />
                  </div>
                </Group>

                <BigLink href="/pricing">Pricing</BigLink>

                <BigLink href="/partners">Solution Partners</BigLink>

                <div className={s.actions}>
                  <Link href="/contact">
                    <a className={s.sales}>Contact sales</a>
                  </Link>

                  {loggedIn ? (
                    <>
                      <div className={s.entry}>
                        <Button
                          as="a"
                          p="small"
                          href="https://dashboard.datocms.com/"
                        >
                          Enter dashboard
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={s.entry}>
                        <Button
                          as="a"
                          p="small"
                          href="https://dashboard.datocms.com/signup"
                        >
                          Get started
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Wrapper>
            </div>
          </>
        )}
      </div>
    </>
  );
}
