import Layout from 'components/MarketplaceLayout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import FormattedDate from 'components/FormattedDate';
import { PLUGINS_PER_PAGE } from 'lib/sitemap';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import Paginator from 'components/Paginator';
import { range } from 'range';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import s from './style.module.css';
import truncate from 'truncate';
import MegaphoneIcon from 'public/icons/regular/megaphone.svg';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';

export const getStaticPaths = gqlStaticPaths(
  gql`
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
  gql`
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
  ({ page }) => ({
    first: PLUGINS_PER_PAGE,
    skip: PLUGINS_PER_PAGE * parseInt(page),
  }),
  (data) => ({
    ...data,
    perPage: PLUGINS_PER_PAGE,
  }),
);

export default function Plugins({
  plugins,
  preview,
  meta,
  pluginsPage,
  perPage,
}) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      {!router.isFallback && <Head>{renderMetaTags(pluginsPage.seo)}</Head>}
      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroTitle}>Community Plugins</div>
          <div className={s.heroDesc}>
            Easily expand and customize the capabilities of DatoCMS with
            community plugins
          </div>
        </div>
        <Link as="/docs/building-plugins" href="/docs/[...chunks]">
          <a className={s.announce}>
            <MegaphoneIcon /> <strong>Want to be in catalog?</strong> Learn how
            create your own plugin, or copy and remix existing ones in our
            documentation! →
          </a>
        </Link>
        <div className={s.grid}>
          {plugins &&
            plugins.map((post) => (
              <PluginBox
                key={post.packageName}
                title={post.title}
                href="/marketplace/plugins/i/[...chunks]"
                as={`/marketplace/plugins/i/${post.packageName}`}
                image={
                  post.coverImage && post.coverImage.responsiveImage ? (
                    <Image
                      className={s.image}
                      data={post.coverImage.responsiveImage}
                    />
                  ) : (
                    <PluginImagePlacehoder />
                  )
                }
                description={truncate(post.description, 120)}
                details={
                  <>
                    Released on <FormattedDate date={post.releasedAt} />
                  </>
                }
              />
            ))}
        </div>
        {!router.isFallback && (
          <Paginator
            perPage={perPage}
            currentPage={router.query ? parseInt(router.query.page) : 0}
            totalEntries={meta.count}
            href={(index) =>
              index === 0
                ? '/marketplace/plugins'
                : '/marketplace/plugins/p/[page]'
            }
            as={(index) =>
              index === 0
                ? '/marketplace/plugins'
                : `/marketplace/plugins/p/${index}`
            }
          />
        )}
      </Wrapper>
    </Layout>
  );
}
