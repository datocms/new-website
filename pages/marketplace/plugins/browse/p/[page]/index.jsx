import Head from 'components/Head';
import Layout from 'components/MarketplaceLayout';
import Paginator from 'components/Paginator';
import PluginBox, { PluginImagePlacehoder } from 'components/PluginBox';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import { PLUGINS_PER_PAGE } from 'lib/pages';
import { useRouter } from 'next/router';
import { range } from 'range';
import { useEffect, useRef, useState } from 'react';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';
import truncate from 'truncate';
import { useDebounce } from 'use-debounce';
import { generateUrl } from 'utils/plugins';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(1, Math.ceil(meta.count / Number.parseFloat(PLUGINS_PER_PAGE))),
);

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    query ($first: IntType!, $skip: IntType!) {
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
      skip: PLUGINS_PER_PAGE * Number.parseInt(page),
    }),
    requiredKeys: ['pluginsPage', 'plugins'],
  },
);

export default function Plugins({ plugins, preview, meta, pluginsPage }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(
    new URLSearchParams(router.asPath.split('?')[1]).get('s') || '',
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(plugins);

  const cache = useRef({});

  useEffect(() => {
    if (
      (new URLSearchParams(router.asPath.split('?')[1]).get('s') || '') !==
      debouncedSearchTerm
    ) {
      router.push(
        generateUrl('/marketplace/plugins/browse', {
          s: debouncedSearchTerm,
        }),
        null,
        { shallow: true },
      );
    }

    if (!debouncedSearchTerm) {
      setSearchResults(plugins);
      return;
    }

    let aborted = false;

    if (!cache.current[debouncedSearchTerm]) {
      setIsLoading(true);
      setSearchResults([]);

      cache.current[debouncedSearchTerm] = fetch(
        'https://RBIJYI5XXL-dsn.algolia.net/1/indexes/plugins/query',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Algolia-Application-Id': 'RBIJYI5XXL',
            'X-Algolia-API-Key': '4ad9999225eb7990bd4f641dd1f33357',
          },
          body: JSON.stringify({
            params: new URLSearchParams({
              query: debouncedSearchTerm,
              hitsPerPage: 15,
              getRankingInfo: 1,
            }).toString(),
          }),
        },
      )
        .then((res) => res.json())
        .then((res) => res.hits);
    }

    cache.current[debouncedSearchTerm].then((newSearchResults) => {
      if (!aborted) {
        setSearchResults(newSearchResults);
        setIsLoading(false);
      }
    });

    return () => {
      aborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, setIsLoading, setSearchResults, router.asPath]);

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
        <div className={s.search}>
          <input
            className={s.searchInput}
            placeholder="Search plugins..."
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {searchTerm ? (
          <>
            {isLoading ? (
              <div className={s.loading}>Loading results...</div>
            ) : searchResults.length === 0 ? (
              <div className={s.noResults}>
                No results found... try broaden your search!
              </div>
            ) : (
              <div className={s.grid}>
                {searchResults.map((post) => (
                  <PluginBox
                    key={post.packageName}
                    title={post.title}
                    href={generateUrl(
                      `/marketplace/plugins/i/${post.packageName}`,
                    )}
                    image={
                      post.coverImage?.responsiveImage ? (
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
            )}
          </>
        ) : (
          <>
            <div className={s.grid}>
              {plugins.map((post) => (
                <PluginBox
                  key={post.packageName}
                  title={post.title}
                  href={generateUrl(
                    `/marketplace/plugins/i/${post.packageName}`,
                  )}
                  image={
                    post.coverImage?.responsiveImage ? (
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
              currentPage={
                router.query ? Number.parseInt(router.query.page) : 0
              }
              totalEntries={meta.count}
              href={(index) =>
                index === 0
                  ? '/marketplace/plugins/browse'
                  : `/marketplace/plugins/browse/p/${index}`
              }
            />
          </>
        )}
      </Wrapper>
    </Layout>
  );
}
