import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
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

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      meta: _allPluginsMeta {
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
      plugins: allPlugins(first: $first, skip: $skip, orderBy: installs_DESC) {
        title
        description
        releasedAt
        packageName
        coverImage {
          responsiveImage(imgixParams: { w: 500 }) {
            ...imageFields
          }
        }
        previewImage {
          responsiveImage(imgixParams: { w: 500 }) {
            ...imageFields
          }
        }
      }

      meta: _allPluginsMeta {
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
  data => ({
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
      <Hero
        title={
          <>
            <Highlight>Community Plugins</Highlight>
          </>
        }
        subtitle={<>Extend the functionality of DatoCMS</>}
      />
      <Wrapper>
        <Link as="/docs/building-plugins" href="/docs/[...chunks]">
          <a className={s.announce}>
            <MegaphoneIcon /> <strong>These are Community Plugin!</strong> Learn
            how create your own plugin, or copy and remix existing ones in our
            documentation →
          </a>
        </Link>
        <Masonry
          breakpointCols={{
            default: 3,
            900: 2,
            550: 1,
          }}
          className={s.grid}
          columnClassName={s.column}
        >
          {plugins &&
            plugins.map(post => {
              const image = [
                post.coverImage && post.coverImage.responsiveImage,
                post.previewImage && post.previewImage.responsiveImage,
              ].find(x => x);

              return (
                <Link
                  key={post.packageName}
                  href="/plugins/i/[...chunks]"
                  as={`/plugins/i/${post.packageName}`}
                >
                  <a className={s.post}>
                    {image && <Image className={s.image} data={image} />}
                    <div className={s.postBody}>
                      <h6 className={s.title}>{post.title}</h6>
                      <div className={s.excerpt}>
                        {truncate(post.description, 120)}
                      </div>
                      <div className={s.footer}>
                        <div className={s.date}>
                          Posted on <FormattedDate date={post.releasedAt} />
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
        </Masonry>
        {!router.isFallback && (
          <Paginator
            perPage={perPage}
            currentPage={router.query ? parseInt(router.query.page) : 0}
            totalEntries={meta.count}
            href={index => (index === 0 ? '/plugins' : '/plugins/p/[page]')}
            as={index => (index === 0 ? '/plugins' : `/plugins/p/${index}`)}
          />
        )}
      </Wrapper>
    </Layout>
  );
}
