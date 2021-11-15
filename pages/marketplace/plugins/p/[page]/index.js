import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { Image as DatoImage } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import { PLUGINS_PER_PAGE } from 'lib/pages';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import Paginator from 'components/Paginator';
import { range } from 'range';
import { useRouter } from 'next/router';
import s from './style.module.css';
import truncate from 'truncate';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
import { Announce } from 'components/PluginToolkit';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
    }
  `,
  'page',
  ({ meta }) => range(1, Math.ceil(meta.count / parseFloat(PLUGINS_PER_PAGE))),
);

export const getStaticProps = gqlStaticProps(
  `
    query($first: IntType!, $skip: IntType!) {
      pluginsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      plugins: allPlugins(
        first: $first
        skip: $skip
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: false } }
      ) {
        title
        description
        releasedAt
        packageName
        coverImage {
          responsiveImage(imgixParams: { w: 600, h: 400, fit: crop }) {
            ...imageFields
          }
        }
      }

      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    paramsToVars: ({ page }) => ({
      first: PLUGINS_PER_PAGE,
      skip: PLUGINS_PER_PAGE * parseInt(page),
    }),
    requiredKeys: ['pluginsPage', 'plugins'],
  },
);

export default function Plugins({ plugins, preview, meta, pluginsPage }) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(pluginsPage.seo)}</Head>
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Community Plugins</div>
          <div className={s.heroDesc}>
            Easily expand and customize the capabilities of DatoCMS with
            community plugins
          </div>
        </div>
        <Announce href="/docs/plugin-sdk" center>
          <strong>Want to be in catalog?</strong> Learn how create your own
          plugin, or copy and remix existing ones in our documentation!
        </Announce>
        <div className={s.grid}>
          {plugins &&
            plugins.map((post) => (
              <PluginBox
                key={post.packageName}
                title={post.title}
                href={`/marketplace/plugins/i/${post.packageName}`}
                image={
                  post.coverImage && post.coverImage.responsiveImage ? (
                    <DatoImage
                      className={s.image}
                      data={post.coverImage.responsiveImage}
                    />
                  ) : (
                    <PluginImagePlacehoder hash={post.packageName} />
                  )
                }
                description={truncate(post.description, 120)}
              />
            ))}
        </div>
        <Paginator
          perPage={PLUGINS_PER_PAGE}
          currentPage={router.query ? parseInt(router.query.page) : 0}
          totalEntries={meta.count}
          href={(index) =>
            index === 0
              ? '/marketplace/plugins'
              : `/marketplace/plugins/p/${index}`
          }
        />
      </Wrapper>
    </Layout>
  );
}
