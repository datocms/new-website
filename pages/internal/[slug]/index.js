import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import Head from 'next/head';
import s from './style.module.css';
import {
  allStaticRoutes as staticRoutes,
  staticGeneratorsRoutes,
  customerRoutes,
  // partnerRoutes,
  blogRoutes,
  docsRoutes,
  marketplaceRoutes,
  productUpdatesRoutes,
  sitemapSlugs,
} from 'lib/routes';

export const getStaticPaths = async () => {
  return {
    paths: sitemapSlugs.map((slug) => `/internal/${slug}`),
    fallback: 'blocking',
  };
};

export async function getStaticProps({ params: { slug } }) {
  let routes;

  switch (slug) {
    case 'sitemap-static':
      routes = [
        ...staticRoutes,
        ...(await staticGeneratorsRoutes()),
        ...(await customerRoutes()),
        // ...(await partnerRoutes()),
      ];
      break;
    case 'sitemap-blog':
      routes = await blogRoutes();
      break;
    case 'sitemap-docs':
      routes = await docsRoutes();
      break;
    case 'sitemap-marketplace':
      routes = await marketplaceRoutes();
      break;
    case 'sitemap-product-updates':
      routes = await productUpdatesRoutes();
      break;
    default:
      return { notFound: true };
  }

  return {
    props: {
      routes,
      slug,
    },
  };
}

function slugToReadable(slug) {
  if (typeof slug !== 'string') {
    return '';
  }

  return slug
    .substring(1)
    .split('/')
    .map((s) => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/-|\//g, ' '))
    .join(' - ');
}

export default function Sitemap({ routes, slug }) {
  const title = slug.replace('sitemap-', '').replace(/-|\//g, ' ');

  return (
    <Layout preview={false}>
      <Head>
        <title>DatoCMS {title} page URLs collection - Sitemap DatoCMS</title>
        <meta
          name="description"
          content={`A complete collection of all DatoCMS ${title} pages. Browse this list to quick find and access the page you need`}
        />
      </Head>
      <Hero
        kicker={slug}
        title={
          <>
            <Highlight>All {title} pages</Highlight>
          </>
        }
      />
      <Wrapper>
        <div className={s.body} style={{ maxHeight: routes.length * 15 }}>
          {routes.map((route) => {
            const pageTitle = slugToReadable(route);

            return (
              <a className={s.sitemapLink} href={route} key={route}>
                {pageTitle}
              </a>
            );
          })}
        </div>
      </Wrapper>
    </Layout>
  );
}
