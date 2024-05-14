import Button from 'components/Button';
import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import { LogoImage } from 'components/PluginBox';
import {
  Announce,
  Info,
  NameWithGravatar,
  PluginDetails,
  PluginInfo,
} from 'components/PluginToolkit';
import SmartMarkdown from 'components/SmartMarkdown';
import UiChrome from 'components/UiChrome';
import {
  gqlStaticPaths,
  handleErrors,
  imageFields,
  request,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import tiny from 'tiny-json-http';
import { githubRepoToManifest, githubRepoToUrl } from 'utils/githubRepo';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      posts: allTemplateDemos(first: 100, orderBy: _firstPublishedAt_DESC) {
        code
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map((p) => p.code),
);

export const getStaticProps = handleErrors(
  async ({ params: { slug }, preview }) => {
    const {
      data: { page },
    } = await request({
      query: `
      query StarterQuery($slug: String!) {
        page: templateDemo(filter: { code: { eq: $slug } }) {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
          name
          cmsDescription
          seoH1
          yoastAnalysis
          readme(markdown: true)
          _firstPublishedAt
          code
          githubRepo
          technology {
            name
            logo {
              url
              width
              height
            }
          }
          screenshot {
            url(imgixParams: { auto: format, w: 600, h: 500, fit: crop, crop: top })
            responsiveImage(
              imgixParams: { auto: format, w: 600, h: 500, fit: crop, crop: top }
            ) {
              ...imageFields
            }
          }
          backendScreenshot {
            responsiveImage(imgixParams: { auto: format, h: 500, fit: crop, crop: top }) {
              ...imageFields
            }
          }
        }
      }

      ${seoMetaTagsFields}
      ${imageFields}
    `,
      variables: { slug },
    });

    if (!page) {
      return { notFound: true };
    }

    const { body } = await tiny.get({
      url: githubRepoToManifest(page.githubRepo),
    });

    return {
      props: {
        preview: preview || false,
        page: { ...JSON.parse(body), ...page },
      },
    };
  },
);

const deployments = {
  static: 'Deployable on Netlify or Vercel.',
  server: 'Deployable on Heroku.',
  zeit: 'Deployable on Vercel.',
  copyRepo: '',
};

export default function Starters({ page, preview }) {
  const description = page.cmsDescription || page.description;
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <meta property="og:image" content={page.screenshot.url} />
        <meta name="twitter:image" content={page.screenshot.url} />
      </Head>
      <PluginDetails
        kicker={page.seoH1}
        title={page.name}
        image={<LogoImage logo={page.technology.logo} />}
        shortDescription={description}
        content={page.readme && <SmartMarkdown>{page.readme}</SmartMarkdown>}
        description={
          <>
            {description}. {deployments[page.deploymentType]}
          </>
        }
        actions={
          <Button
            as="a"
            href={`https://dashboard.datocms.com/deploy?repo=${page.githubRepo}`}
            target="_blank"
          >
            Start free project
          </Button>
        }
        announce={
          <Announce
            href="/docs/project-starters-and-templates#generate-a-project-starter-button"
            center
          >
            <strong>Want to create your own starter project?</strong> Learn how
            to do that in our documentation!
          </Announce>
        }
        info={
          <PluginInfo>
            <Info title="Preview URL">
              <a href={page.livePreviewUrl} target="_blank" rel="noreferrer">
                Visit preview website
              </a>
            </Info>
            <Info title="Github repo">
              <a
                href={githubRepoToUrl(page.githubRepo)}
                target="_blank"
                rel="noreferrer"
              >
                {page.githubRepo.split(':')[0]}
              </a>
            </Info>
            <Info title="Publisher">
              <NameWithGravatar email="support@datocms.com" name="DatoCMS" />
            </Info>
          </PluginInfo>
        }
        gallery={[
          <UiChrome key="front" title={page.demoName}>
            <DatoImage
              style={{ display: 'block ' }}
              data={page.screenshot.responsiveImage}
            />
          </UiChrome>,
          page.backendScreenshot && (
            <UiChrome key="back">
              <DatoImage
                style={{ display: 'block ' }}
                data={page.backendScreenshot.responsiveImage}
              />
            </UiChrome>
          ),
        ].filter((i) => !!i)}
      />
    </Layout>
  );
}
