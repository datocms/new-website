import { default as classnames, default as cn } from 'classnames';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import Hamburger from 'public/icons/regular/bars.svg';
import FullLogo from 'public/images/full_logo.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';
import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import RealTime from 'public/images/illustrations/live-31.svg';
import StructuredText from 'public/images/illustrations/scontent.svg';
import DataIntegrity from 'public/images/illustrations/lock2.svg';
import Workflows from 'public/images/illustrations/workflows.svg';

import { useCallback, useEffect, useState } from 'react';
import { getCookie } from 'utils/cookies';
import s from './style.module.css';

const Group = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.group}>
      <button
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

const LearnResource = ({ href, title, target, description }) => {
  const content = (
    <>
      <div className={s.learnResourceTitle}>{title}</div>
      <div className={s.learnResourceDesc}>{description}</div>
    </>
  );

  return target ? (
    <a className={s.learnResource} href={href} target={target}>
      {content}
    </a>
  ) : (
    <Link href={href}>
      <a className={s.learnResource}>{content}</a>
    </Link>
  );
};

const Feature = ({ href, icon: Icon, title, description }) => (
  <Link href={href}>
    <a className={s.feature}>
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
      <div className={classnames(s.root)} data-datocms-noindex>
        <Wrapper>
          <div className={s.innerRoot}>
            <Link href="/">
              <a className={s.logo}>
                <FullLogo />
              </a>
            </Link>
            <div className={s.space} />
            <button className={s.hamburger} onClick={toggleVisibility}>
              <Hamburger />
            </button>
          </div>
        </Wrapper>
        {visible && (
          <>
            <div className={s.pane}>
              <Wrapper>
                <Group title="Why DatoCMS">
                  <div className={s.sectionTitle}>Team</div>
                  <Link href="/team/developers">
                    <a className={s.extraLink}>For developers</a>
                  </Link>
                  <Link href="/team/digital-marketers">
                    <a className={s.extraLink}>For digital marketers</a>
                  </Link>
                  <Link href="/team/content-creators">
                    <a className={s.extraLink}>For content creators</a>
                  </Link>

                  <div className={s.sectionTitle}>Features</div>
                  <Feature
                    icon={Cdn}
                    title="Worldwide CDN"
                    href="/features/worldwide-cdn"
                    description="Performant, secure, and close to every customer"
                  />

                  <Feature
                    icon={GraphQl}
                    title="GraphQL Content API"
                    href="/features/headless-cms-graphql"
                    description="Develop faster with powerful developer tools"
                  />

                  <Feature
                    icon={Image}
                    title="Images API"
                    href="/features/images-api"
                    description="Endless image transformations at your disposal"
                  />

                  <Feature
                    icon={Video}
                    title="Video streaming/encoding"
                    href="/features/video-api"
                    description="Produce videos and serve them fast to any device"
                  />

                  <Feature
                    icon={Languages}
                    title="Multi-language"
                    href="/features/headless-cms-multi-language"
                    description="Reach your global audience with localized content"
                  />

                  <Feature
                    icon={Layouts}
                    title="Dynamic layouts"
                    href="/features/dynamic-layouts"
                    description="Easily build dynamic layouts for landing pages"
                  />

                  <Feature
                    icon={DataIntegrity}
                    title="Content integrity"
                    href="/features/data-integrity"
                    description="Clean content is timeless content"
                  />

                  <Feature
                    icon={Workflows}
                    title="Workflows"
                    isNew
                    href="/features/workflow-cms"
                    description="Supercharge your content approval process"
                  />

                  <Feature
                    icon={RealTime}
                    title="Real-time updates"
                    isNew
                    href="/features/real-time"
                    description="Live changes to content on production website"
                  />

                  <Feature
                    icon={StructuredText}
                    title="Structured text"
                    isNew
                    href="/features/structured-text"
                    description="Freedom for editors, control for developers"
                  />

                  <div className={s.sectionTitle}>Enterprise</div>
                  <Link href="/enterprise">
                    <a className={s.extraLink}>DatoCMS for Enterprise</a>
                  </Link>
                </Group>

                <BigLink href="/customers">Customers</BigLink>

                <Group title="Learn">
                  <div className={s.twocols}>
                    <LearnResource
                      title="Documentation"
                      description="Guides, tutorials and API reference"
                      href="/docs"
                    />

                    <LearnResource
                      title="Blog"
                      description="Culture, learnings, and announcements"
                      href="/blog"
                    />

                    <LearnResource
                      title="Product updates"
                      description="Changelog for features and improvements"
                      href="/product-updates"
                    />

                    <LearnResource
                      title="Community forum"
                      description="Ask questions/discuss with your peers"
                      href="https://community.datocms.com"
                      target="_blank"
                    />
                    <LearnResource
                      title="Slack channel"
                      description="Chat live with other devs"
                      href="/slack"
                    />
                    <LearnResource
                      title="Support"
                      description="Got questions? Get in touch!"
                      href="/support"
                    />
                  </div>
                </Group>

                <Group title="Marketplace">
                  <div className={s.twocols}>
                    <LearnResource
                      href="/marketplace/starters"
                      title="Starter projects"
                      description="Start with a fully configured DatoCMS project"
                    />
                    <LearnResource
                      href="/marketplace/plugins"
                      title="Plugins"
                      description="Easily expand the capabilities of DatoCMS"
                    />
                    <LearnResource
                      href="/marketplace/hosting"
                      title="Hosting &amp; Builds"
                      description="No matter the stack you're using, we've got you covered"
                    />

                    <LearnResource
                      href="/marketplace/enterprise"
                      title="Enterprise apps"
                      description="Keep your company data secure"
                    />
                  </div>
                </Group>

                <BigLink href="/pricing">Pricing</BigLink>

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
                          Try for free!
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
