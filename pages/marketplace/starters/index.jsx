import Head from 'components/Head';
import MarketplaceCard from 'components/MarketplaceCard';
import Layout from 'components/MarketplaceLayout';
import { Announce } from 'components/PluginToolkit';
import Wrapper from 'components/Wrapper';
import { handleErrors, imageFields, request } from 'lib/datocms';
import tiny from 'tiny-json-http';
import { githubRepoToManifest } from 'utils/githubRepo';
import s from './style.module.css';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    data: { starters },
  } = await request({
    query: `
      {
        starters: allTemplateDemos(first: 100) {
          id
          name
          cmsDescription
          code
          starterType
          badge {
            name
            emoji
          }
          label
          githubRepo
          technology {
            name
            logo {
              url
            }
            squareLogo {
              url
            }
          }
          screenshot {
            responsiveImage(
              imgixParams: { auto: format, w: 600, h: 400, fit: crop }
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
  const fullFledged = starters.filter(
    (starter) => starter.starterType === 'full_fledged',
  );
  const techStarters = starters.filter(
    (starter) => starter.starterType === 'tech_starter',
  );
  const community = starters.filter(
    (starter) => starter.starterType === 'community',
  );

  return (
    <Layout preview={preview}>
      <Head>
        <title>Project starters - Free demo projects - Marketplace</title>
      </Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Starters</div>
          <div className={s.heroDesc}>
            Start with a fully configured DatoCMS project, a best-practice
            frontend and free hosting
          </div>
        </div>
      </Wrapper>

      <div className={s.firstPartyStarters}>
        <div className={s.groupWrapper}>
          <div className={s.intro}>
            <h2>Full fledged demos</h2>
            <p>
              Use our pre-built demo projects to see all of DatoCMS&apos;s
              features in a <strong>realistic production-ready setup</strong>.
              Includes many example content types, and advanced features.
            </p>
          </div>
          <section className={s.fullFledged}>
            {fullFledged?.map((item) => (
              <MarketplaceCard
                key={item.code}
                href={`/marketplace/starters/${item.code}`}
                image={item.screenshot.responsiveImage}
                technology={item.technology}
                text={{
                  title: item.name,
                  description: item.cmsDescription,
                }}
                highlight={'Best choice to start!'}
                badge={item.badge}
                label={item.label}
                size="large"
              />
            ))}
          </section>
        </div>

        <div className={s.groupWrapper}>
          <div className={s.intro}>
            <h2>Tech starter kits</h2>
            <p>
              Kickstart your next project with our{' '}
              <strong>official scaffolds</strong>. They offer all the best
              practices to integrate DatoCMS with your frontend framework, with
              minimal content and styling.
            </p>
          </div>
          <section className={s.techStarters}>
            {techStarters?.map((item) => (
              <MarketplaceCard
                key={item.code}
                href={`/marketplace/starters/${item.code}`}
                technology={item.technology.squareLogo || item.technology.logo}
                text={{
                  title: item.name,
                  description: item.cmsDescription,
                }}
                badge={item.badge}
                label={item.label}
              />
            ))}
          </section>
        </div>
      </div>

      <Wrapper>
        <div className={s.intro}>
          <h2>Community templates</h2>
          <p>
            Discover the projects created by the community. They are not
            officially supported by DatoCMS, but they can be a great source of
            inspiration to kickstart your next project.
          </p>
        </div>

        <Announce
          href="/docs/project-starters-and-templates#generate-a-project-starter-button"
          center
        >
          <strong>Want to create your own starter project?</strong> Learn how to
          do that in our documentation!
        </Announce>

        <div className={s.community}>
          {community?.map((item) => (
            <MarketplaceCard
              key={item.code}
              href={`/marketplace/starters/${item.code}`}
              image={item.screenshot.responsiveImage}
              text={{
                title: item.name,
                description: item.cmsDescription,
              }}
              badge={item.badge}
              label={item.label}
              boxed={false}
              orientation="horizontal"
              size="small"
            />
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
