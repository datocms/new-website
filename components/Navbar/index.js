import Wrapper from 'components/Wrapper';
import FullLogo from 'public/images/full_logo.svg';
import Link from 'next/link';
import s from './style.css';
import useWindowScroll from '@react-hook/window-scroll';
import classnames from 'classnames';

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
                <div className={s.groupTitle}><span>Why DatoCMS</span></div>
                <div className={s.groupPane}>
                  <div className={s.groupPaneCols}>
                    <div className={s.groupPaneCol}>
                      <div className={s.groupPaneColTitle}>Team</div>
                      <div className={s.groupPaneLinks}>
                        <div className={s.groupPaneLink}>
                          <Link href="/team/developers">
                            <a>For developers</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/team/digital-marketers">
                            <a>For digital marketers</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/team/content-creators">
                            <a>For content creators</a>
                          </Link>
                        </div>
                      </div>
                      <div className={s.groupPaneColTitle}>Enterprise</div>
                      <div className={s.groupPaneLinks}>
                        <div className={s.groupPaneLink}>
                          <Link href="/enterprise">
                            <a>DatoCMS for Enterprise</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className={s.groupPaneCol}>
                      <div className={s.groupPaneColTitle}>Features</div>
                      <div className={s.groupPaneLinks}>
                        <div className={s.groupPaneLink}>
                          <Link href="/features/worldwide-cdn">
                            <a>Worldwide CDN</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/features/images-api">
                            <a>Images API</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Video streaming/encoding</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Multi-language</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Dynamic layouts</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Editing experience</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className={s.groupPaneCol}>
                      <div className={s.groupPaneColTitle}>Success stories</div>
                      <div className={s.groupPaneLinks}>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Arduino</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Hashicorp</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Nike</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Chilli's</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/foo">
                <a className={s.entry}><span>Integrations</span></a>
              </Link>

              <div className={s.group}>
                <div className={s.groupTitle}><span>Learn</span></div>
                <div className={s.groupPane}>
                  <div className={s.groupPaneCols}>
                    <div className={s.groupPaneCol}>
                      <div className={s.groupPaneLinks}>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Blog</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Product updates</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Developers</a>
                          </Link>
                        </div>
                        <div className={s.groupPaneLink}>
                          <Link href="/">
                            <a>Help center</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/foo">
                <a className={s.entry}><span>Pricing</span></a>
              </Link>
            </div>{' '}
          </div>
        </Wrapper>
      </div>
    </>
  );
}
