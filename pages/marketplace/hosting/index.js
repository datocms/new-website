import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps } from 'lib/datocms';
import Head from 'components/Head';
import PluginBox, { LogoImage } from 'components/PluginBox';
import s from 'pages/marketplace/plugins/browse/p/[page]/style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      items: allHostingApps(first: 100) {
        slug
        title
        description: shortDescription
        logo {
          url
          width
          height
        }
      }
    }
  `,
);

export default function Hosting({ items, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Hosting and building - Marketplace</title>
      </Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Hosting &amp; CI Building</div>
          <div className={s.heroDesc}>
            Server, serverless or static: no matter the stack you&#39;re using,
            we&#39;ve got you covered
          </div>
        </div>
        <div className={s.grid}>
          {items &&
            items.map((item) => (
              <PluginBox
                key={item.slug}
                href={`/marketplace/hosting/${item.slug}`}
                title={item.title}
                description={item.description}
                image={<LogoImage logo={item.logo} />}
              />
            ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
