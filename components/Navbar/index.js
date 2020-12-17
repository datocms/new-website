import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import classnames from 'classnames';
import Button from 'components/Button';
import { useState, useEffect } from 'react';
import { getCookie } from 'utils/cookies';
import cn from 'classnames';
import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';
import Developers from 'public/images/illustrations/developers-2.svg';
import Marketers from 'public/images/illustrations/marketers.svg';
import ContentCreators from 'public/images/illustrations/content-editors2.svg';

import External from 'public/icons/regular/external-link.svg';

const TitleDesc = ({ href, title, description, target, isNew }) =>
  target ? (
    <a className={s.titleDesc} href={href} target={target}>
      <div className={s.titleDescBody}>
        <div className={s.titleDescTitle}>
          {title}
          {isNew && (
            <>
              {' '}
              <span className={s.titleDescNew}>New</span>
            </>
          )}
        </div>
        <div className={s.titleDescDescription}>{description}</div>
      </div>
    </a>
  ) : (
    <Link href={href}>
      <a className={s.titleDesc}>
        <div className={s.titleDescBody}>
          <div className={s.titleDescTitle}>
            {title}
            {isNew && (
              <>
                {' '}
                <span className={s.titleDescNew}>New</span>
              </>
            )}
          </div>
          <div className={s.titleDescDescription}>{description}</div>
        </div>
      </a>
    </Link>
  );

const Feature = ({ href, icon: Icon, title, description }) => (
  <Link href={href}>
    <a className={s.flag}>
      <div className={s.flagIcon}>
        <Icon />
      </div>
      <div className={s.flagBody}>
        <div className={s.flagTitle}>{title}</div>
        <div className={s.flagDescription}>{description}</div>
      </div>
    </a>
  </Link>
);

const Team = ({ href, icon: Icon, title }) => (
  <Link href={href}>
    <a className={cn(s.flag, s.flagSmall)}>
      <div className={s.flagIcon}>
        <Icon />
      </div>
      <div className={s.flagBody}>
        <div className={s.flagTitle}>{title}</div>
      </div>
    </a>
  </Link>
);

const Pane = ({ children }) => (
  <div className={s.pane}>
    <div className={s.paneInner}>{children}</div>
  </div>
);

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!getCookie('datoAccountEmail'));
  }, []);

  return (
    <>
      <div className={s.placeholder} />
      <div className={classnames(s.root)} data-datocms-noindex>
        <Wrapper>
          <div className={s.innerRoot}>
            <Link href="/">
              <a className={s.logo}>
                <FullLogo />
              </a>
            </Link>
            <div className={s.entries}>
              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Why DatoCMS</span>
                </div>
                <Pane>
                  <div className={s.cols}>
                    <div className={cn(s.section, s.sectionInverse)}>
                      <div className={s.sectionTitle}>Happy team</div>

                      <Team
                        href="/team/developers"
                        icon={Developers}
                        title="For developers"
                      />

                      <Team
                        href="/team/digital-marketers"
                        icon={Marketers}
                        title="For digital marketers"
                      />

                      <Team
                        href="/team/content-creators"
                        icon={ContentCreators}
                        title="For content creators"
                      />

                      <div className={s.sectionTitle}>Enterprise</div>
                      <Link href="/enterprise">
                        <a className={s.extraLink}>DatoCMS for Enterprise</a>
                      </Link>
                    </div>
                    <div className={s.section}>
                      <div className={s.sectionTitle}>Features</div>

                      <div className={s.grid2}>
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
                          description="Endless transformations at your disposal"
                        />

                        <Feature
                          icon={Video}
                          title="Video API"
                          href="/features/video-streaming-encoding"
                          description="Produce videos and serve them fast to any device"
                        />

                        <Feature
                          icon={Languages}
                          title="Multi-language"
                          href="/features/multi-language"
                          description="Reach global audience with localized content"
                        />

                        <Feature
                          icon={Layouts}
                          title="Dynamic layouts"
                          href="/features/dynamic-layouts"
                          description="Easily build dynamic layouts for landing pages"
                        />
                      </div>
                    </div>
                  </div>
                </Pane>
              </div>

              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Customers</span>
                </div>

                <Pane>
                  <div className={s.cols}>
                    <div className={cn(s.section, s.sectionInverse)}>
                      <div className={s.sectionTitle}>Technologies</div>
                      <Link href="/cms/nextjs">
                        <a className={s.extraLink}>Next.js</a>
                      </Link>
                      <Link href="/cms/gatsbyjs">
                        <a className={s.extraLink}>Gatsby</a>
                      </Link>
                      <Link href="/cms/nuxt-js">
                        <a className={s.extraLink}>Nuxt.js</a>
                      </Link>
                      <Link href="/cms/hugo">
                        <a className={s.extraLink}>Hugo</a>
                      </Link>
                      <Link href="/cms/jekyll">
                        <a className={s.extraLink}>Jekyll</a>
                      </Link>
                      <Link href="/cms/react">
                        <a className={s.extraLink}>React</a>
                      </Link>
                      <Link href="/cms/vue">
                        <a className={s.extraLink}>Vue.js</a>
                      </Link>
                      <Link href="/cms/middleman">
                        <a className={s.extraLink}>Middleman</a>
                      </Link>
                    </div>
                    <div className={s.section}>
                      <div className={s.sectionTitle}>Success stories</div>
                      <div className={s.grid2}>
                        <TitleDesc
                          href="/customers/oberlo"
                          title="Shopify Orberlo"
                          description="Painless switch to static from Wordpress"
                          isNew
                        />

                        <TitleDesc
                          href="/customers/hashicorp"
                          title="Hashicorp"
                          description="How HashiCorp delivers a reliable editorial workflow"
                        />

                        <TitleDesc
                          href="/customers/chillys"
                          title="Chilly's Bottles"
                          description="How Rotate built a 2M users a month e-commerce"
                        />

                        <TitleDesc
                          href="/customers/matter-supply"
                          title="Matter Supply"
                          description="How to deliver an Emmy award-campaign in 4 weeks"
                        />

                        <TitleDesc
                          href="/customers/wonderland"
                          title="Wonderland"
                          description="How to setup visually-stunning projects in minutes"
                        />

                        <TitleDesc
                          href="/customers/dovetail"
                          title="Dovetail"
                          description="Why DatoCMS is their headless CMS of choice"
                        />
                      </div>
                    </div>
                  </div>
                </Pane>
              </div>

              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Learn</span>
                </div>
                <Pane>
                  <div className={s.cols}>
                    <div className={s.section}>
                      <div className={s.grid1}>
                        <TitleDesc
                          title="Documentation"
                          description="Guides, tutorials and API reference"
                          href="/docs"
                        />

                        <TitleDesc
                          title="Blog"
                          description="Culture, learnings, and announcements"
                          href="/blog"
                        />

                        <TitleDesc
                          title="Product updates"
                          description="Changelog for new features and improvements"
                          href="/product-updates"
                        />
                      </div>
                    </div>
                    <div className={s.section}>
                      <div className={s.grid1}>
                        <TitleDesc
                          title={
                            <>
                              Community forum <External />
                            </>
                          }
                          description="Ask questions and discuss with your peers"
                          href="https://community.datocms.com"
                          target="_blank"
                        />
                        <TitleDesc
                          title="Slack channel"
                          description="Chat live with other devs in our Slack channel"
                          href="/slack"
                        />
                        <TitleDesc
                          title="Support"
                          description="Got questions? Get in touch with our team"
                          href="/support"
                        />
                      </div>
                    </div>
                  </div>
                </Pane>
              </div>

              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Marketplace</span>
                </div>

                <Pane>
                  <div className={s.cols}>
                    <div className={s.cols}>
                      <div className={s.section}>
                        <div className={s.grid1}>
                          <TitleDesc
                            href="/marketplace/starters"
                            title="Starter projects"
                            description="Start with a fully configured DatoCMS project"
                          />
                          <TitleDesc
                            href="/marketplace/plugins"
                            title="Community plugins"
                            description="Easily expand the capabilities of DatoCMS"
                          />
                        </div>
                      </div>
                      <div className={s.section}>
                        <div className={s.grid1}>
                          <TitleDesc
                            href="/marketplace/hosting"
                            title="Hosting &amp; Builds"
                            description="No matter the stack you're using, we've got you covered"
                          />

                          <TitleDesc
                            href="/marketplace/enterprise"
                            title="Enterprise apps"
                            description="Keep your company data secure"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Pane>
              </div>

              <Link href="/pricing">
                <a className={s.entry}>
                  <span>Pricing</span>
                </a>
              </Link>
            </div>

            <div className={s.actions}>
              <Link href="/contact">
                <a className={cn(s.entry, loggedIn && s.entryContact)}>
                  <span>Contact sales</span>
                </a>
              </Link>

              {loggedIn ? (
                <>
                  <Button
                    as="a"
                    p="small"
                    href="https://dashboard.datocms.com/"
                  >
                    Enter dashboard
                  </Button>
                </>
              ) : (
                <>
                  <a
                    href="https://dashboard.datocms.com/login"
                    className={cn(s.entry, s.entryContact)}
                  >
                    <span>Log in</span>
                  </a>
                  <Button
                    as="a"
                    p="small"
                    href="https://dashboard.datocms.com/signup"
                  >
                    Try for free!
                  </Button>
                </>
              )}
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
}
