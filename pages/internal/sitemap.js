import s from './style.module.css';
import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import Head from 'next/head';
import {
  allStaticRoutes as staticRoutes,
  staticGeneratorsRoutes,
  customerRoutes,
  partnerRoutes,
  blogRoutes,
  docsRoutes,
  marketplaceRoutes,
  productUpdatesRoutes,
} from 'lib/routes';

export async function getStaticProps() {
  const allStaticRoutes = [
    ...staticRoutes,
    ...(await staticGeneratorsRoutes()),
    ...(await customerRoutes()),
    ...(await partnerRoutes()),
  ];

  return {
    props: {
      allStaticRoutes,
      blogRoutes: await blogRoutes(),
      docsRoutes: await docsRoutes(),
      marketplaceRoutes: await marketplaceRoutes(),
      productUpdatesRoutes: await productUpdatesRoutes(),
    },
  };
}

export default function Sitemap({
  allStaticRoutes,
  blogRoutes,
  docsRoutes,
  marketplaceRoutes,
  productUpdatesRoutes,
}) {
  return (
    <Layout preview={false}>
      <Head>
        <title>Sitemap</title>
      </Head>
      <Hero
        kicker="Sitemap"
        title={
          <>
            <Highlight>All DatoCMS pages</Highlight>
          </>
        }
      />
      <Wrapper>
        <div className={s.body}>
          <div>
            <h2 className={s.sitemapTitle}>Static</h2>
            {allStaticRoutes.map((route) => (
              <a className={s.sitemapLink} href={route} key={route}>
                {route}
              </a>
            ))}
          </div>
          <div>
            <h2 className={s.sitemapTitle}>Product Updates</h2>
            {productUpdatesRoutes.map((route) => (
              <a className={s.sitemapLink} href={route} key={route}>
                {route}
              </a>
            ))}
          </div>
          <div>
            <h2 className={s.sitemapTitle}>Blog</h2>
            {blogRoutes.map((route) => (
              <a className={s.sitemapLink} href={route} key={route}>
                {route}
              </a>
            ))}
          </div>
          <div>
            <h2 className={s.sitemapTitle}>Marketplace</h2>
            {marketplaceRoutes.map((route) => (
              <a className={s.sitemapLink} href={route} key={route}>
                {route}
              </a>
            ))}
          </div>
          <div>
            <h2 className={s.sitemapTitle}>Docs</h2>
            {docsRoutes &&
              docsRoutes.map((route) => (
                <a className={s.sitemapLink} href={route} key={route}>
                  {route}
                </a>
              ))}
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
