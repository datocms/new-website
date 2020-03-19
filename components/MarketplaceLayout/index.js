import BaseLayout from 'components/BaseLayout';
import Wrapper from 'components/Wrapper';
import Footer from 'components/Footer';
import Link from 'next/link';
import ActiveLink from 'components/ActiveLink';
import s from './style.module.css';
import Logo from 'public/images/logo.svg';
import LeftArrow from 'public/icons/regular/long-arrow-alt-left.svg';

export default function IntegrationsLayout({ children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <div className={s.notice}>
        <Wrapper>
          <strong>🎈 Welcome to the Marketplace</strong> — Explore and discover
          the ecosystem around DatoCMS, and share your own work with the
          community!
        </Wrapper>
      </div>
      <div className={s.root}>
        <div className={s.header}>
          <Wrapper>
            <div className={s.headerInner}>
              <Link href="/marketplace">
                <a className={s.logo}>
                  <Logo />
                  <span>Marketplace</span>
                </a>
              </Link>
              <div className={s.categories}>
                <ActiveLink activeClassName={s.active} href="/marketplace">
                  <a>
                    <span>Home</span>
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName={s.active}
                  href="/marketplace/starters"
                >
                  <a>
                    <span>Starter projects</span>
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName={s.active}
                  href="/marketplace/plugins"
                >
                  <a>
                    <span>Plugins</span>
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName={s.active}
                  href="/marketplace/hosting"
                >
                  <a>
                    <span>Hosting &amp; Building</span>
                  </a>
                </ActiveLink>
                <ActiveLink
                  activeClassName={s.active}
                  href="/marketplace/enterprise"
                >
                  <a>
                    <span>Enterprise</span>
                  </a>
                </ActiveLink>
              </div>

              <div className={s.nav}>
                <Link href="/">
                  <a>
                    <LeftArrow /> Back to datocms.com
                  </a>
                </Link>
              </div>
            </div>
          </Wrapper>
        </div>

        {children}

        <Footer noCta />
      </div>
    </BaseLayout>
  );
}
