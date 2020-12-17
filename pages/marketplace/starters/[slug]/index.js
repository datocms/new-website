import { useRouter } from 'next/router';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import Layout from 'components/MarketplaceLayout';
import Button from 'components/Button';
import FormattedDate from 'components/FormattedDate';
import UiChrome from 'components/UiChrome';
import { Image } from 'react-datocms';
import { LogoImage } from 'components/PluginBox';
import {
  PluginInfo,
  Info,
  NameWithGravatar,
  PluginDetails,
} from 'components/PluginToolkit';
import {
  gqlStaticPaths,
  request,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';
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

export const getStaticProps = async ({ params: { slug }, preview }) => {
  const {
    data: { page },
  } = await request({
    query: `
      query StarterQuery($slug: String!) {
        page: templateDemo(filter: { code: { eq: $slug } }) {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
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
            url(imgixParams: { w: 600, h: 500, fit: crop, crop: top })
            responsiveImage(
              imgixParams: { w: 600, h: 500, fit: crop, crop: top }
            ) {
              ...imageFields
            }
          }
          backendScreenshot {
            responsiveImage(imgixParams: { h: 500, fit: crop, crop: top }) {
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

  const { body } = await tiny.get({
    url: githubRepoToManifest(page.githubRepo),
  });

  return {
    props: {
      preview: preview || false,
      page: { ...JSON.parse(body), ...page },
    },
  };
};

const deployments = {
  static: 'Deployable on Netlify or Vercel.',
  server: 'Deployable on Heroku.',
  zeit: 'Deployable on Vercel.',
  copyRepo: '',
};

export default function EnterpriseApp({ page, preview }) {
  const { isFallback } = useRouter();

  return (
    <Layout preview={preview}>
      {!isFallback && (
        <Head>
          {renderMetaTags(page.seo)}
          <meta property="og:image" content={page.screenshot.url} />
          <meta name="twitter:image" content={page.screenshot.url} />
        </Head>
      )}
      <PluginDetails
        isFallback={isFallback}
        title={!isFallback && page.name}
        image={!isFallback && <LogoImage logo={page.technology.logo} />}
        shortDescription={!isFallback && page.description}
        description={
          !isFallback && (
            <>
              {page.description}. {deployments[page.deploymentType]}
            </>
          )
        }
        actions={
          !isFallback && (
            <Button
              as="a"
              href={`https://dashboard.datocms.com/deploy?repo=${page.githubRepo}`}
              target="_blank"
            >
              Start free project
            </Button>
          )
        }
        info={
          <PluginInfo>
            <Info title="Preview URL" isFallback={isFallback}>
              {!isFallback && (
                <a href={page.livePreviewUrl} target="_blank">
                  Visit preview website
                </a>
              )}
            </Info>
            <Info title="Github repo" isFallback={isFallback}>
              {!isFallback && (
                <a href={githubRepoToUrl(page.githubRepo)} target="_blank">
                  {page.githubRepo.split(':')[0]}
                </a>
              )}
            </Info>
            <Info title="Publisher">
              <NameWithGravatar email="support@datocms.com" name="DatoCMS" />
            </Info>
            <Info title="First released" isFallback={isFallback}>
              {!isFallback && <FormattedDate date={page._firstPublishedAt} />}
            </Info>
          </PluginInfo>
        }
        gallery={
          !isFallback &&
          [
            <UiChrome key="front" title={page.demoName}>
              <Image
                style={{ display: 'block ' }}
                data={page.screenshot.responsiveImage}
              />
            </UiChrome>,
            page.backendScreenshot && (
              <UiChrome key="back">
                <Image
                  style={{ display: 'block ' }}
                  data={page.backendScreenshot.responsiveImage}
                />
              </UiChrome>
            ),
          ].filter((i) => !!i)
        }
      />
    </Layout>
  );
}
