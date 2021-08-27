import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import { request, imageFields } from 'lib/datocms';
import { Image as DatoImage } from 'react-datocms';
import Head from 'next/head';
import PluginBox from 'components/PluginBox';
import s from 'pages/marketplace/plugins/p/[page]/style.module.css';
import LazyImage from 'components/LazyImage';
import tiny from 'tiny-json-http';
import { githubRepoToManifest } from 'utils/githubRepo';
import { handleErrors } from 'lib/datocms';
import { Announce } from 'components/PluginToolkit';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    data: { starters },
  } = await request({
    query: `
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
        url: githubRepoToManifest(starter.githubRepo),
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
});

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
        <Announce
          href="/docs/project-starters-and-templates#generate-a-project-starter-button"
          center
        >
          <strong>Want to create your own starter project?</strong> Learn how to
          do that in our documentation!
        </Announce>
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
                  <DatoImage
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
