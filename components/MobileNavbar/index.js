import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import Hamburger from 'public/icons/regular/bars.svg';
import Button from 'components/Button';
import cn from 'classnames';

import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';

import External from 'public/icons/regular/external-link.svg';

const Group = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.group}>
      <button
        className={cn(s.groupTitle, s.groupTitleHandle, {
          [s.handleOpen]: open,
        })}
        onClick={() => setOpen(x => !x)}
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

const LearnResource = ({ href, title, description, target }) =>
  target ? (
    <a className={s.extraLink} href={href} target={target}>
      {title}
    </a>
  ) : (
    <Link href={href}>
      <a className={s.extraLink}>{title}</a>
    </Link>
  );

const Feature = ({ href, icon: Icon, title, description }) => (
  <Link href={href}>
    <a className={s.feature}>
      <div className={s.featureIcon}>
        <Icon />
      </div>
      <div className={s.featureBody}>
        <div className={s.featureTitle}>{title}</div>
      </div>
    </a>
  </Link>
);

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = useCallback(() => {
    setVisible(v => !v);
  });

  return (
    <>
      <div className={classnames(s.root)}>
        <Wrapper>
          <div className={s.innerRoot}>
            <Link href="/">
              <a className={s.logo}>
                <FullLogo height="auto" />
              </a>
            </Link>
            <div className={s.space} />
            <button className={s.hamburger} onClick={toggleVisibility}>
              <Hamburger />
            </button>
          </div>
        </Wrapper>
        {visible && (
          <div className={s.pane}>
            <Wrapper>
              <Group title="Why DatoCMS">
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
                  href="/features/graphql-content-api"
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
                  href="/features/video-streaming-encoding"
                  description="Produce videos and serve them fast to any device"
                />

                <Feature
                  icon={Languages}
                  title="Multi-language"
                  href="/features/multi-language"
                  description="Reach your global audience with localized content"
                />

                <Feature
                  icon={Layouts}
                  title="Dynamic layouts"
                  href="/features/dynamic-layouts"
                  description="Easily build dynamic layouts for landing pages"
                />

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

                <div className={s.sectionTitle}>Enterprise</div>
                <Link href="/enterprise">
                  <a className={s.extraLink}>DatoCMS for Enterprise</a>
                </Link>
              </Group>

              <Group title="Success stories">
                <Link href="/customers/[slug]" as="/customers/arduino">
                  <a className={s.extraLink}>Arduino</a>
                </Link>
                <Link href="/customers/[slug]" as="/customers/hashicorp">
                  <a className={s.extraLink}>Hashicorp</a>
                </Link>
                <Link href="/customers/[slug]" as="/customers/nike">
                  <a className={s.extraLink}>Nike</a>
                </Link>
                <Link href="/customers/[slug]" as="/customers/chilly-s">
                  <a className={s.extraLink}>Chilly's Bottles</a>
                </Link>
              </Group>

              <BigLink href="/integrations">Integrations</BigLink>

              <Group title="Learn">
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
                  description="Changelog for new features and improvements"
                  href="/product-updates"
                />

                <LearnResource
                  title={
                    <>
                      Community forum <External />
                    </>
                  }
                  description="Ask questions and start discussions with your peers."
                  href="https://community.datocms.com"
                  target="_blank"
                />
                <LearnResource
                  title="Slack channel"
                  description="Chat live with other developers in our Slack channel"
                  href="/slack"
                />
                <LearnResource
                  title="Support"
                  description="Get in touch with our team"
                  href="/support"
                />
              </Group>

              <BigLink href="/pricing">Pricing</BigLink>

              <div className={s.actions}>
                <Link href="/contact">
                  <a className={s.sales}>Contact sales</a>
                </Link>

                <Button
                  as="a"
                  p="small"
                  href="https://dashboard.datocms.com/signup"
                >
                  Try for free!
                </Button>
              </div>
            </Wrapper>
          </div>
        )}
      </div>
    </>
  );
}
