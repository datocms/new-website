import Layout from 'components/IntegrationsLayout';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import { Image } from 'react-datocms';
import Head from 'next/head';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import PluginBox from 'components/PluginBox';
import s from 'pages/integrations/plugins/p/[page]/style.module.css';
import LazyImage from 'components/LazyImage';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      starters: allTemplateDemos(first: 100) {
        id
        code
        githubRepo
        deploymentType
        description
        name
        demoName
        technology {
          name
          logo {
            url
          }
        }
        category {
          name
        }
        screenshot {
          responsiveImage(
            imgixParams: { w: 400, h: 300, fit: crop, crop: top }
          ) {
            ...imageFields
          }
        }
      }
    }

    ${imageFields}
  `,
);

export default function Plugins({ starters, preview }) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      <Head>
        <title>Project starters - Free demo projects - Marketplace</title>
      </Head>
      <Wrapper>
        <div className={s.grid}>
          {starters &&
            starters.map(item => (
              <PluginBox
                title={item.name}
                key={item.code}
                as={`/integrations/starters/${item.code}`}
                href="/integrations/starters/[slug]"
                description={
                  <div className={s.demoDesc}>
                    <div className={s.demoDescBody}>{item.description}</div>
                    <div className={s.demoDescImage}>
                      <LazyImage
                        className={s.techLogo}
                        src={item.technology.logo.url}
                      />
                    </div>
                  </div>
                }
                image={
                  <Image
                    className={s.boxImageImage}
                    data={item.screenshot.responsiveImage}
                  />
                }
              />
            ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
