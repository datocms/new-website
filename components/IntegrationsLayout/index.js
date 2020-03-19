import BaseLayout from 'components/BaseLayout';
import Wrapper from 'components/Wrapper';
import Footer from 'components/Footer';
import Link from 'next/link';
import ActiveLink from 'components/ActiveLink';
import s from './style.module.css';
import Logo from 'public/images/logo.svg';

export default function IntegrationsLayout({ children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <div className={s.root}>
        <Wrapper>
          <div className={s.header}>
            <Link href="/integrations">
              <a className={s.logo}>
                <Logo />
                <span>Marketplace</span>
              </a>
            </Link>
            <div className={s.categories}>
              <ActiveLink
                activeClassName={s.active}
                href="/integrations/starters"
              >
                <a>
                  <span>Starter projects</span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName={s.active}
                href="/integrations/plugins"
              >
                <a>
                  <span>Plugins</span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName={s.active}
                href="/integrations/hosting"
              >
                <a>
                  <span>Hosting &amp; Building</span>
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName={s.active}
                href="/integrations/enterprise"
              >
                <a>
                  <span>Enterprise</span>
                </a>
              </ActiveLink>
            </div>

            <div className={s.nav}>
              <Link href="/">
                <a>Go to datocms.com</a>
              </Link>
            </div>
          </div>
        </Wrapper>

        {children}

        <Footer noCta />
      </div>
    </BaseLayout>
  );
}
