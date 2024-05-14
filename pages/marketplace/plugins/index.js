import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
import { gqlStaticProps, imageFields, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import React from 'react';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import truncate from 'truncate';
import { generateUrl } from 'utils/plugins';
import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      pluginsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        highlighted {
          ...pluginFields
        }
        collections {
          title
          plugins {
            ...pluginFields
          }
        }
      }

      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: "false" } }) {
        count
      }

      latest: allPlugins(
        first: 12
        orderBy: _createdAt_DESC
        filter: { manuallyDeprecated: { eq: "false" } }
      ) {
        ...pluginFields
      }

      popular: allPlugins(
        first: 12
        orderBy: installs_DESC
        filter: { manuallyDeprecated: { eq: "false" } }
      ) {
        ...pluginFields
      }
    }

    fragment pluginFields on PluginRecord {
      id
      title
      description
      releasedAt
      packageName
      coverImage {
        responsiveImage(
          imgixParams: { auto: format, w: 600, h: 400, fit: crop }
        ) {
          ...imageFields
        }
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
);

const Big = ({ title, plugins, browse }) => {
  const router = useRouter();

  return (
    <div className={s.category}>
      <div className={s.categoryHeader}>
        <div className={s.categoryLeft}>
          <div className={s.categoryTitle}>{title}</div>
        </div>
        {browse}
      </div>
      <div className={s.grid}>
        {plugins.map((post) => (
          <PluginBox
            key={post.packageName}
            title={post.title}
            href={generateUrl(`/marketplace/plugins/i/${post.packageName}`)}
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
    </div>
  );
};

const Section = ({ title, plugins, browse }) => {
  const router = useRouter();

  return (
    <div className={s.category}>
      <div className={s.categoryHeader}>
        <div className={s.categoryLeft}>
          <div className={s.categoryTitle}>{title}</div>
        </div>
        {browse}
      </div>
      <div className={s.boxes}>
        {plugins.map((item) => (
          <div className={s.boxContainer} key={item.packageName}>
            <PluginBox
              href={generateUrl(`/marketplace/plugins/i/${item.packageName}`)}
              title={item.title}
              description={truncate(item.description, 55)}
              image={
                item.coverImage && item.coverImage.responsiveImage ? (
                  <DatoImage
                    className={s.image}
                    data={item.coverImage.responsiveImage}
                  />
                ) : (
                  <PluginImagePlacehoder hash={item.packageName} />
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Table = ({ title, plugins, browse }) => {
  const router = useRouter();

  return (
    <div className={s.category}>
      <div className={s.categoryHeader}>
        <div className={s.categoryLeft}>
          <div className={s.categoryTitle}>{title}</div>
        </div>
        {browse}
      </div>
      <div className={s.table}>
        {plugins.map((item, i) => {
          return (
            <Link
              href={generateUrl(`/marketplace/plugins/i/${item.packageName}`)}
              key={item.packageName}
            >
              <a className={s.tableCell}>
                <div className={s.tableCellInner}>
                  <div className={s.tableCellImage}>
                    {item.coverImage && item.coverImage.responsiveImage ? (
                      <DatoImage
                        className={s.image}
                        data={item.coverImage.responsiveImage}
                      />
                    ) : (
                      <PluginImagePlacehoder hash={item.packageName} />
                    )}
                  </div>
                  <div className={s.tableCellBody}>
                    <div className={s.tableCellTitle}>
                      {i + 1}. {item.title}
                    </div>
                    <div className={s.tableCellDesc}>
                      {truncate(item.description, 60)}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default function Page({ preview, pluginsPage, latest, popular, meta }) {
  const router = useRouter();

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(pluginsPage.seo)}</Head>
      <div className={s.hero}>
        <div className={s.heroTitle}>Community Plugins</div>
        <div className={s.heroDesc}>
          Easily expand and customize the capabilities of DatoCMS with community
          plugins
        </div>
      </div>
      <form
        className={s.search}
        onSubmit={(e) => {
          e.preventDefault();
          router.push(
            generateUrl(`/marketplace/plugins/browse`, {
              s: document.getElementById('searchInput').value,
            }),
          );
        }}
      >
        <input
          className={s.searchInput}
          placeholder="Search plugins..."
          type="search"
          id="searchInput"
        />
      </form>
      <Big title="Editors' Choice" plugins={pluginsPage.highlighted} />
      <Table
        title="Most popular"
        plugins={popular}
        browse={
          <Link href={generateUrl(`/marketplace/plugins/browse`)}>
            <a className={s.browseAll}>
              View all ({meta.count}) <ArrowIcon />
            </a>
          </Link>
        }
      />
      {pluginsPage.collections.map((collection) => (
        <React.Fragment key={collection.title}>
          <Section title={collection.title} plugins={collection.plugins} />
        </React.Fragment>
      ))}
      <Table title="Just released" plugins={latest} />
    </Layout>
  );
}
