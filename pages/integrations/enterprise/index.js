import Layout from 'components/IntegrationsLayout';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PluginBox, { LogoImage } from 'components/PluginBox';
import s from 'pages/integrations/plugins/p/[page]/style.module.css';
import truncate from 'truncate';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      startersPage: pluginsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
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

    ${seoMetaTagsFields}
  `,
);

export default function Enterprise({ items, preview, startersPage }) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      {!router.isFallback && <Head>{renderMetaTags(startersPage.seo)}</Head>}
      <Wrapper>
        <div className={s.grid}>
          {items &&
            items.map(item => (
              <PluginBox
                key={item.slug}
                as={`/integrations/enterprise/${item.slug}`}
                href="/integrations/enterprise/[slug]"
                title={item.title}
                description={truncate(item.description, 55)}
                image={<LogoImage style="azure" logo={item.logo} />}
              />
            ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
