import Layout from 'components/IntegrationsLayout';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps } from 'lib/datocms';
import Head from 'next/head';
import gql from 'graphql-tag';
import PluginBox, { LogoImage } from 'components/PluginBox';
import s from 'pages/integrations/plugins/p/[page]/style.module.css';

export const getStaticProps = gqlStaticProps(
  gql`
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
        <div className={s.grid}>
          {items &&
            items.map(item => (
              <PluginBox
                key={item.slug}
                as={`/integrations/enterprise/${item.slug}`}
                href="/integrations/enterprise/[slug]"
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
