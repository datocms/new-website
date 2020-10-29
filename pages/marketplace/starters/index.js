import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import { request, imageFields } from 'lib/datocms';
import { Image } from 'react-datocms';
import Head from 'next/head';
import gql from 'graphql-tag';
import PluginBox from 'components/PluginBox';
import s from 'pages/marketplace/plugins/p/[page]/style.module.css';
import LazyImage from 'components/LazyImage';
import tiny from 'tiny-json-http';

export const getStaticProps = async ({ preview }) => {
  const {
    data: { starters },
  } = await request({
    query: gql`
      {
        starters: allTemplateDemos(first: 100) {
          id
          code
          githubRepo
          technology {
            name
            logo {
              url
            }
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
  });

  const startersData = await Promise.all(
    starters.map(async (starter) => {
      const { body } = await tiny.get({
        url: `https://raw.githubusercontent.com/${starter.githubRepo}/master/datocms.json`,
      });
      return { ...JSON.parse(body), ...starter };
    }),
  );

  return {
    props: {
      preview: preview || false,
      starters: startersData,
    },
  };
};

export default function Plugins({ starters, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Project starters - Free demo projects - Marketplace</title>
      </Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Starter projects</div>
          <div className={s.heroDesc}>
            Start with a fully configured DatoCMS project, a best-practice
            frontend and free hosting
          </div>
        </div>
        <div className={s.grid}>
          {starters &&
            starters.map((item) => (
              <PluginBox
                title={item.name}
                key={item.code}
                href={`/marketplace/starters/${item.code}`}
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
