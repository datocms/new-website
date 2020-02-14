import Wrapper from 'components/Wrapper';
import FinalCta from 'components/FinalCta';
import StatusBadge from 'components/StatusBadge';
import Link from 'next/link';
import s from './style.css';

export default function Footer() {
  return (
    <>
      <div className={s.footerBg}>
        <FinalCta />
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
                  <div className={s.monoLink}>
                    <Link href="/">
                      <a>Success stories</a>
                    </Link>
                  </div>
                  <div className={s.group}>
                    <div className={s.groupTitle}>Features</div>
                    <div className={s.groupLinks}>
                      <div className={s.groupLink}>
                        <Link href="/features/wordwide-cdn">
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
                        <Link href="/">
                          <a>Blog</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Product updates</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Documentation</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Community forum</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Slack channel</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Help center</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Status page</a>
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
                        <Link href="/">
                          <a>About</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Brand assets</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/legal/privacy-policy">
                          <a>Privacy</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Security</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      </div>
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
            <a href="mailto:support@datocms.com">support@datocms.com</a> –
            Copyright ©{new Date().getUTCFullYear()} Dato srl, all rights
            reserved — P.IVA 06969620480
          </div>
        </Wrapper>
      </div>
    </>
  );
}
