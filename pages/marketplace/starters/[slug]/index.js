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
  gqlStaticProps,
  seoMetaTagsFields,
  imageFields,
} from 'lib/datocms';
import gql from 'graphql-tag';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      posts: allTemplateDemos(first: 100, orderBy: _firstPublishedAt_DESC) {
        code
      }
    }
  `,
  'slug',
  ({ posts }) => posts.map(p => p.code),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query EnterpriseAppQuery($slug: String!) {
      page: templateDemo(filter: { code: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        code
        githubRepo
        deploymentType
        description
        name
        demoName
        demoUrl
        technology {
          name
          logo {
            url
            width
            height
          }
        }
        category {
          name
          code
        }
        screenshot {
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
);

const deployments = {
  static: ', deployable on Netlify or ZEIT',
  server: ', deployable on Heroku',
  copyRepo: '',
};

export default function EnterpriseApp({ page, preview }) {
  const { isFallback } = useRouter();

  return (
    <Layout preview={preview}>
      {!isFallback && <Head>{renderMetaTags(page.seo)}</Head>}
      <PluginDetails
        isFallback={isFallback}
        title={!isFallback && page.name}
        image={!isFallback && <LogoImage logo={page.technology.logo} />}
        shortDescription={!isFallback && page.description}
        description={
          !isFallback && (
            <>
              {page.category && page.category.name} in {page.technology.name}
              {page.deploymentType in deployments
                ? deployments[page.deploymentType]
                : page.deploymentType}
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
                <a href={page.demoUrl} target="_blank">
                  Visit preview website
                </a>
              )}
            </Info>
            <Info title="Github repo" isFallback={isFallback}>
              {!isFallback && (
                <a
                  href={`https://github.com/${page.githubRepo}`}
                  target="_blank"
                >
                  {page.githubRepo}
                </a>
              )}
            </Info>
            <Info title="Publisher">
              <NameWithGravatar email="support@datocms.com" name="DatoCMS" />
            </Info>
            <Info title="First released">
              <FormattedDate date={'2019-03-12'} />
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
          ].filter(i => !!i)
        }
      />
    </Layout>
  );
}
