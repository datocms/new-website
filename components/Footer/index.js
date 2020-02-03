import Wrapper from 'components/Wrapper';
import FinalCta from 'components/FinalCta';
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
                        <Link href="/">For digital marketers</Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">For content creators</Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">For developers</Link>
                      </div>
                    </div>
                  </div>

                  <div className={s.monoLink}>
                    <Link href="/">Pricing</Link>
                  </div>

                  <div className={s.monoLink}>
                    <Link href="/">DatoCMS for Enterprise</Link>
                  </div>
                </div>
                <div className={s.col}>
                <div className={s.monoLink}>
                    <Link href="/">Success stories</Link>
                  </div>
                  <div className={s.group}>
                    <div className={s.groupTitle}>Features</div>
                    <div className={s.groupLinks}>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Worldwide CDN</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Images API</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Video streaming/encoding</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Multi-language</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Dynamic layouts</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
                          <a>Editing experience</a>
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
                        <Link href="/">
                          <a>Terms</a>
                        </Link>
                      </div>
                      <div className={s.groupLink}>
                        <Link href="/">
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
          Ciao
        </Wrapper>
      </div>
    </>
  );
}
