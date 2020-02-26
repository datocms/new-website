import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.css';
import useWindowScroll from '@react-hook/window-scroll';
import classnames from 'classnames';

import Developers from 'public/images/illustrations/developers-2.svg';
import Marketers from 'public/images/illustrations/marketers.svg';
import Editors from 'public/images/illustrations/content-editors2.svg';

import Cdn from 'public/images/illustrations/global-cdn-2.svg';
import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Languages from 'public/images/illustrations/multilanguage-2.svg';
import Layouts from 'public/images/illustrations/dynamic-layouts.svg';

export const Feature = ({ href, icon: Icon, title, description }) => (
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
  const scrollY = useWindowScroll(60);

  return (
    <>
      <div className={s.placeholder} />
      <div className={classnames(s.root, { [s.rootHover]: scrollY > 10 })}>
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
                <div className={s.groupPane}>
                  <div className={s.cols}>
                  <div className={s.extraWhy}>
                      <div className={s.sectionTitle}>Team</div>

                      <Link href="/team/developers">
                        <a className={s.extraLink}>
                          {/* <div className={s.icon}>
                              <Developers />
                            </div> */}
                          For developers
                        </a>
                      </Link>

                      <Link href="/team/digital-marketers">
                        <a className={s.extraLink}>
                          {/* <div className={s.icon}>
                              <Marketers />
                            </div> */}
                          For digital marketers
                        </a>
                      </Link>

                      <Link href="/team/content-creators">
                        <a className={s.extraLink}>
                          {/* <div className={s.icon}>
                              <Editors />
                            </div> */}
                          For content creators
                        </a>
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
                      <Link href="/customers/[slug]" as="/customers/chillys-bottles">
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
                </div>
              </div>

              <Link href="/">
                <a className={s.entry}>
                  <span>Integrations</span>
                </a>
              </Link>

              {/* <div className={s.group}>
                <div className={s.groupTitle}><span>Learn</span></div>
                <div className={s.groupPane}>
                  <div className={s.cols}>
                    <div className={s.groupPaneCol}>
                      
                        <div className={s.groupPaneLink}>
                          <Link href="/blog">
                            <a>Blog</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/product-updates">
                            <a>Product updates</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/docs">
                            <a>Documentation</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/support">
                            <a>Help center</a>
                          </Link>
                        </div>
                      </div>
                  </div>
                </div>
              </div> */}

              <Link href="/foo">
                <a className={s.entry}>
                  <span>Pricing</span>
                </a>
              </Link>
            </div>
          </div>
        </Wrapper>
      </div>
    </>
  );
}
