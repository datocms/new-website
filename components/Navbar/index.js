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
import Workflows from 'public/images/illustrations/workflows.svg';
import ContentCreators from 'public/images/illustrations/content-editors2.svg';
import RealTime from 'public/images/illustrations/live-31.svg';
import DataIntegrity from 'public/images/illustrations/lock2.svg';
import StructuredText from 'public/images/illustrations/scontent.svg';

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
              <span className={s.isNew}>New</span>
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
                <span className={s.isNew}>New</span>
              </>
            )}
          </div>
          <div className={s.titleDescDescription}>{description}</div>
        </div>
      </a>
    </Link>
  );

const Feature = ({ href, icon: Icon, title, description, keyword, isNew }) => (
  <Link href={href}>
    <a className={s.flag} title={keyword}>
      <div className={s.flagIcon}>
        <Icon />
      </div>
      <div className={s.flagBody}>
        <div className={s.flagTitle}>
          {title}
          {isNew && (
            <>
              {' '}
              <span className={s.isNew}>New</span>
            </>
          )}
        </div>
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
                        href="/team/best-cms-for-developers"
                        icon={Developers}
                        title="For developers"
                      />

                      <Team
                        href="/team/cms-digital-marketing"
                        icon={Marketers}
                        title="For digital marketers"
                      />

                      <Team
                        href="/team/content-creators"
                        icon={ContentCreators}
                        title="For content creators"
                      />

                      <div className={s.sectionTitle}>
                        Ready integrations with
                      </div>
                      <div className={s.integrations}>
                        <Link href="/cms/nextjs-cms">
                          <a className={s.integrationLink}>Next</a>
                        </Link>
                        <Link href="/cms/gatsby-cms">
                          <a className={s.integrationLink}>Gatsby</a>
                        </Link>
                        <Link href="/cms/nuxtjs-cms">
                          <a className={s.integrationLink}>Nuxt</a>
                        </Link>
                        <Link href="/cms/react-cms">
                          <a className={s.integrationLink}>React</a>
                        </Link>
                        <Link href="/cms/vue-js-cms">
                          <a className={s.integrationLink}>Vue</a>
                        </Link>
                        <Link href="/cms/hugo-cms">
                          <a className={s.integrationLink}>Hugo</a>
                        </Link>
                        <Link href="/cms/jekyll-cms">
                          <a className={s.integrationLink}>Jekyll</a>
                        </Link>
                        <Link href="/cms/remix-cms">
                          <a className={s.integrationLink}>Remix</a>
                        </Link>
                        <Link href="/marketplace/hosting/netlify">
                          <a className={s.integrationLink}>Netlify</a>
                        </Link>
                        <Link href="/marketplace/hosting/vercel">
                          <a className={s.integrationLink}>Vercel</a>
                        </Link>
                      </div>
                    </div>

                    <div className={s.section}>
                      <div className={s.sectionTitle}>Features</div>

                      <div className={s.grid2}>
                        <Feature
                          icon={Cdn}
                          title="Worldwide CDN"
                          keyword="fastest-headless-cms"
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
                          description="Endless transformations at your disposal"
                        />

                        <Feature
                          icon={Video}
                          title="Video API"
                          keyword="Video API"
                          href="/features/video-api"
                          description="Produce videos and serve them fast to any device"
                        />

                        <Feature
                          icon={Languages}
                          title="Multi-language"
                          keyword="Headless CMS multi language"
                          href="/features/headless-cms-multi-language"
                          description="Reach global audience with localized content"
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
                          description="Validations, sandbox environments and roles"
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
                      </div>
                    </div>
                  </div>
                </Pane>
              </div>

              <div className={s.group}>
                <Link href="/customers">
                  <a className={s.groupTitle}>
                    <span>Customers</span>
                  </a>
                </Link>

                <Pane>
                  <div className={s.cols}>
                    <div className={cn(s.section, s.sectionInverse)}>
                      <div className={s.sectionTitle}>Quotes</div>
                      <Link href="/wall">
                        <a className={s.extraLink}>Read our Testimonials</a>
                      </Link>

                      <div className={s.sectionTitle}>Enterprise</div>
                      <Link href="/enterprise-headless-cms">
                        <a className={s.extraLink}>DatoCMS for Enterprise</a>
                      </Link>
                    </div>
                    <div className={s.section}>
                      <div className={s.sectionTitle}>Success stories</div>
                      <div className={s.grid2}>
                        <TitleDesc
                          href="/customers/polestar"
                          title="Polestar"
                          description="Localise everything to build a global carmaker website"
                          isNew
                        />

                        <TitleDesc
                          href="/customers/oberlo"
                          title="Shopify Orberlo"
                          description="Painless switch to static from Wordpress"
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
                          href="/customers/dovetail"
                          title="Dovetail"
                          description="Why DatoCMS is their headless CMS of choice"
                        />
                      </div>
                      <Link href="/customers">
                        <a className={s.viewAll}>
                          Browse all the case studies &raquo;
                        </a>
                      </Link>
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
                            title="Plugins"
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

              <Link href="/partners">
                <a className={s.entry}>
                  <span>Partners</span>
                </a>
              </Link>
            </div>

            <div className={s.actions}>
              <Link href="/pricing">
                <a className={s.entry}>
                  <span>Pricing</span>
                </a>
              </Link>

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
