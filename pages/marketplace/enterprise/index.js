import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps } from 'lib/datocms';
import Head from 'components/Head';
import PluginBox, { LogoImage } from 'components/PluginBox';
import s from 'pages/marketplace/plugins/browse/p/[page]/style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      items: allEnterpriseApps(first: 100) {
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

export default function Enterprise({ items, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Enterprise apps - Marketplace</title>
      </Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Enterprise Apps</div>
          <div className={s.heroDesc}>
            Keep company data secure with centralized users management and
            assets storage
          </div>
        </div>
        <div className={s.grid}>
          {items &&
            items.map((item) => (
              <PluginBox
                key={item.slug}
                href={`/marketplace/enterprise/${item.slug}`}
                title={item.title}
                description={item.description}
                image={<LogoImage style="azure" logo={item.logo} />}
              />
            ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
