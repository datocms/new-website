import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import classnames from 'classnames';
import Button from 'components/Button';
import { useState, useEffect } from 'react';
import { getCookie } from 'utils/cookies';
import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';

import External from 'public/icons/regular/external-link.svg';

const LearnResource = ({ href, title, description, target }) =>
  target ? (
    <a className={s.learnRes} href={href} target={target}>
      <div className={s.learnResBody}>
        <div className={s.learnResTitle}>{title}</div>
        <div className={s.learnResDescription}>{description}</div>
      </div>
    </a>
  ) : (
    <Link href={href}>
      <a className={s.learnRes}>
        <div className={s.learnResBody}>
          <div className={s.learnResTitle}>{title}</div>
          <div className={s.learnResDescription}>{description}</div>
        </div>
      </a>
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
        <div className={s.featureDescription}>{description}</div>
      </div>
    </a>
  </Link>
);

const Pane = ({ children }) => (
  <div className={s.groupPane}>
    <div className={s.groupPaneInner}>{children}</div>
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
      <div className={classnames(s.root)}>
        <Wrapper>
          <div className={s.innerRoot}>
            <Link href="/">
              <a className={s.logo}>
                <FullLogo width={110} height="auto" />
              </a>
            </Link>
            <div className={s.entries}>
              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Why DatoCMS</span>
                </div>
                <Pane>
                  <div className={s.cols}>
                    <div className={s.extraWhy}>
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

                      <div className={s.sectionTitle}>Success stories</div>

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
                    </div>
                    <div className={s.features}>
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
                    </div>
                  </div>
                </Pane>
              </div>

              <div className={s.group}>
                <div className={s.groupTitle}>
                  <span>Integrations</span>
                </div>

                <Pane>
                  <div className={s.cols}>
                    <div className={s.extraWhy}>
                      <div className={s.sectionTitle}>Technologies</div>
                      <Link href="/cms/[slug]" as="/cms/nextjs">
                        <a className={s.extraLink}>Next.js</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/gatsbyjs">
                        <a className={s.extraLink}>Gatsby</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/nuxt-js">
                        <a className={s.extraLink}>Nuxt.js</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/hugo">
                        <a className={s.extraLink}>Hugo</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/jekyll">
                        <a className={s.extraLink}>Jekyll</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/react">
                        <a className={s.extraLink}>React</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/vue">
                        <a className={s.extraLink}>Vue</a>
                      </Link>
                      <Link href="/cms/[slug]" as="/cms/middleman">
                        <a className={s.extraLink}>Middleman</a>
                      </Link>
                    </div>
                    <div className={s.cols}>
                      <div className={s.learnDocs}>
                        <LearnResource
                          href="/integrations/starters"
                          title="Project starters"
                          description="Start with a fully configured DatoCMS project, a best-practice frontend and free hosting"
                        />
                        <LearnResource
                          href="/integrations/plugins"
                          title="Community plugins"
                          description="Easily expand and customize the capabilities of DatoCMS with community plugins"
                        />
                      </div>
                      <div className={s.learnDocs}>
                        <LearnResource
                          href="/integrations/hosting"
                          title="Hosting &amp; Builds"
                          description="Server, serverless or static: no matter the stack you're using, we've got you covered"
                        />

                        <LearnResource
                          href="/integrations/enterprise"
                          title="Enterprise apps"
                          description="Keep your company data secure with centralized users management and assets storage"
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
                    <div className={s.learnDocs}>
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
                    </div>
                    <div className={s.help}>
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
                <a className={s.entry}>
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
