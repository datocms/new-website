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
        <div className={s.grid}>
          {items &&
            items.map(item => (
              <PluginBox
                key={item.slug}
                as={`/integrations/hosting/${item.slug}`}
                href="/integrations/hosting/[slug]"
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
