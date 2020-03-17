import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.module.css';
import classnames from 'classnames';
import Button from 'components/Button';
import docHref from 'utils/docHref';

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
                  <div className={s.integrations}>
                    <div className={s.marketplace}>
                      <Link href="/integrations">
                        <a className={s.marketplaceTitle}>
                          Integrations Marketplace
                        </a>
                      </Link>
                      <div className={s.integrationGroup}>
                        <div className={s.integrationGroupTitle}>
                          Web technologies
                        </div>

                        <ul className={s.integrationTop}>
                          <li className={s.integration}>
                            <Link href="/cms/[slug]" as="/cms/gatsbyjs">
                              <a>Gatsby</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href="/cms/[slug]" as="/cms/nextjs">
                              <a>Next</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href="/cms/[slug]" as="/cms/nuxt-js">
                              <a>Nuxt.js</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href="/cms/[slug]" as="/cms/hugo">
                              <a>Hugo</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href="/integrations">
                              <a>Others</a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className={s.integrationGroup}>
                        <div className={s.integrationGroupTitle}>
                          Hosting &amp; CI
                        </div>

                        <ul className={s.integrationTop}>
                          <li className={s.integration}>
                            <Link
                              href={docHref('/docs/netlify')}
                              as="/docs/netlify"
                            >
                              <a>Netlify</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href={docHref('/docs/zeit')} as="/docs/zeit">
                              <a>ZEIT</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link
                              href={docHref('/docs/travis')}
                              as="/docs/travis"
                            >
                              <a>Travis</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link
                              href={docHref('/cms/gitlab')}
                              as="/cms/gitlab"
                            >
                              <a>Gitlab</a>
                            </Link>
                          </li>
                          <li className={s.integration}>
                            <Link href="/integrations">
                              <a>Others</a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Link href="/plugins">
                      <a className={s.plugins}>
                        <div className={s.learnResTitle}>Community plugins</div>
                        <div className={s.learnResDescription}>
                          Easily extend the functionality of DatoCMS
                        </div>
                      </a>
                    </Link>
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

              <div className={s.entry}>
                <Button
                  as="a"
                  p="small"
                  href="https://dashboard.datocms.com/signup"
                >
                  Try for free!
                </Button>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
}
