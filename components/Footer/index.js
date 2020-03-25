import Wrapper from 'components/Wrapper';
import FinalCta from 'components/FinalCta';
import StatusBadge from 'components/StatusBadge';
import cn from 'classnames';
import Link from 'next/link';
import s from './style.module.css';

export default function Footer({ noCta }) {
  return (
    <div
      className={cn(s.footerBg, { [s.noCta]: noCta, [s.cta]: !noCta })}
      data-datocms-noindex
    >
      {!noCta && <FinalCta />}
      <div className={s.footerRoot}>
        <Wrapper>
          <div className={s.footerInnerRoot}>
            <div className={s.cols}>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Team</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/team/developers">
                        <a>For developers</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/team/digital-marketers">
                        <a>For digital marketers</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/team/content-creators">
                        <a>For content creators</a>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={s.monoLink}>
                  <Link href="/">
                    <a>Pricing</a>
                  </Link>
                </div>

                <div className={s.monoLink}>
                  <Link href="/enterprise">
                    <a>DatoCMS for Enterprise</a>
                  </Link>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Features</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/features/worldwide-cdn">
                        <a>Worldwide CDN</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/features/graphql-content-api">
                        <a>GraphQL Content API</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/features/images-api">
                        <a>Images API</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/features/video-streaming-encoding">
                        <a>Video streaming/encoding</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/features/multi-language">
                        <a>Multi-language</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/features/dynamic-layouts">
                        <a>Dynamic layouts</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Resources</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/product-updates">
                        <a>Product updates</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/docs">
                        <a>Documentation</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/support">
                        <a>Support</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/contact">
                        <a>Contact sales</a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={s.group}>
                  <div className={s.groupTitle}>Social</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/blog">
                        <a>Blog</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <a href="https://community.datocms.com" target="_blank">
                        Community forum
                      </a>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/slack">
                        <a>Slack channel</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <a href="https://www.twitter.com/datocms" target="_blank">
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Technologies</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/nextjs">
                        <a className={s.extraLink}>Next.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/gatsbyjs">
                        <a className={s.extraLink}>Gatsby</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/nuxt-js">
                        <a className={s.extraLink}>Nuxt.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/hugo">
                        <a className={s.extraLink}>Hugo</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/jekyll">
                        <a className={s.extraLink}>Jekyll</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/react">
                        <a className={s.extraLink}>React</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/vue">
                        <a className={s.extraLink}>Vue.js</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/cms/[slug]" as="/cms/middleman">
                        <a className={s.extraLink}>Middleman</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={s.col}>
                <div className={s.group}>
                  <div className={s.groupTitle}>Status</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <StatusBadge />
                    </div>
                  </div>
                </div>

                <div className={s.group}>
                  <div className={s.groupTitle}>Company</div>
                  <div className={s.groupLinks}>
                    <div className={s.groupLink}>
                      <Link href="/company/about">
                        <a>About</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/company/brand-assets">
                        <a>Brand assets</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/legal/privacy-policy">
                        <a>Privacy</a>
                      </Link>
                    </div>
                    <div className={s.groupLink}>
                      <Link href="/legal/security">
                        <a>Security</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
        <div className={s.finalFooter}>
          <Wrapper>
            <div className={s.finalLinks}>
              <Link href="/legal/privacy-policy">
                <a className={s.finalLink}>Privacy policy</a>
              </Link>
              <Link href="/legal/cookie-policy">
                <a className={s.finalLink}>Cookie policy</a>
              </Link>
              <Link href="/legal/gdpr">
                <a className={s.finalLink}>GDPR Compliance</a>
              </Link>
              <Link href="/legal/terms">
                <a className={s.finalLink}>Terms of Service</a>
              </Link>
            </div>
            <div className={s.finalLine}>
              <a href="mailto:support@datocms.com">support@datocms.com</a>{' '}
              <span>
                ©{new Date().getUTCFullYear()} Dato srl, all rights reserved
              </span>{' '}
              <span>P.IVA 06969620480</span>
            </div>
          </Wrapper>
        </div>
      </div>
    </div>
  );
}
